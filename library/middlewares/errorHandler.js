const log = require("../logger").log;

async function errorHandlerMiddleware(ctx, next) {
    const config = ctx.container.get("config");

    try {
        await next();
    } catch (err) {
        log("error", "server error", {error: err.message, stack: err.stack,});

        // Render custom 500 page
        if (!err.status || err.status === 500) {
            ctx.status = 500;

            const data = {};
            if (config.get("node_env") !== "production") {
                data.stack = err.stack;
            }

            await ctx.render("500", data);
        }
    }
}

module.exports = errorHandlerMiddleware;
