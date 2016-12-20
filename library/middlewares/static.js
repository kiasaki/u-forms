const path = require("path");
const send = require("koa-send");

function static(root) {
    const opts = {root: path.resolve(root),};
    return async function(ctx, next) {
        if (ctx.method == "HEAD" || ctx.method == "GET") {
            if (await send(ctx, ctx.path, opts)) {
                return;
            }
        }
        await next();
    };
}

module.exports = static;
