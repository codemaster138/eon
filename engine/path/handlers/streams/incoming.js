
const createLog = require('../../../../libs/log');
const log = createLog('eonjs', 'FT_LOGLEVEL');

class IncomingHTTPData {
    constructor(req) {
        this.whatwg = new URL(req.url, `http://${req.headers.host}`);
        this.method = req.method;
        this.body = undefined;
        this.error = false;
        this.headers = req.headers;
        this.rawHeaders = req.rawHeaders;
        this.url = req.url;
        this.pathname = this.whatwg.pathname;
        this._events = {};
        if (req.method == 'GET') {
            this.query = {};
            this.whatwg.searchParams.forEach((val, key) => this.query[key] = val);
        } else {
            let body = "";
            req.on('data', d => body += d.toString());
            req.on('end', _ => {
                try {
                    if (req.headers['content-type'] === 'application/json') {
                        log('info', 'request body is json');
                        this.body = JSON.parse(body || '');
                    } else {
                        log('info', 'assumed request body is form');
                        this.body = require('querystring').parse(body || '');
                    }
                    this._fire('body');
                } catch (e) {
                    log('warning', `Error while parsing body '${body}': ${e.message}`);
                    this.error = e;
                }
            });
        }
    }

    on(e, l) {
        if (this._events[e]) return this._events[e].push(l);
        this._events[e] = [l];
    }

    _fire(e, ...d) {
        if (this._events[e]) this._events[e].forEach(l => l(...d));
    }
}

module.exports = IncomingHTTPData;