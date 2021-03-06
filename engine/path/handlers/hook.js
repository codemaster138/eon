const BaseHandler = require('./text');
const { IncommingHTTPData, OutgoingHTTPData } = require('./streams');

class HookCallbackHandler extends BaseHandler {
    invoke(req, res) {
        const Req = new IncommingHTTPData(req);
        if (Req.error) return res.writeHead(400).end('Invalid request: ' + Req.error.message);
        const Res = new OutgoingHTTPData(res);
        this.callback(Req, Res);
    }
}

module.exports = HookCallbackHandler;