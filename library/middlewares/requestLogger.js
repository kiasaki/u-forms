const log = require("../logger").log;

async function requestLoggerMiddleware(ctx, next) {
    var start = new Date;
    await next();
    var ms = new Date - start;
    log("info", "request", {method: ctx.method, url: ctx.url, ms,});
}

module.exports = requestLoggerMiddleware;
