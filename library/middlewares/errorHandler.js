const log = require("../logger").log;

async function errorHandlerMiddleware(ctx, next) {
    const config = ctx.container.get("config");

    try {
        await next();
    } catch (err) {
        const data = {};
        if (config.get("node_env") !== "production") {
            data.stack = err.stack;
        }

        if (err.status === 404) {
            ctx.status = 404;
            await ctx.render("error/404", data);
        } else {
            log("error", "server error", {error: err.message, stack: err.stack});

            ctx.status = err.status || 500;
            await ctx.render("error/500", data);
        }
    }
}

module.exports = errorHandlerMiddleware;
