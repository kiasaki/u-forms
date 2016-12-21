const {clone, merge,} = require("ramda");
const path = require("path");
const consolidate = require("consolidate");

function views({
    root,
    engineName = "ejs",
    extension = "html",
    options = {},
}) {
    return async function(ctx, next) {
        ctx.state = ctx.state || {};
        ctx.render = async function(view, extraState = {}) {
            const state = merge(clone(options), merge(ctx.state, extraState));
            ctx.type = "text/html";

            const viewPath = path.resolve(root, view + "." + extension);
            const render = consolidate[engineName];
            if (!engineName || !render) {
                throw new Error("Views middleware missing engine!");
            }

            ctx.body = await render(viewPath, state);
        };
        await next();
    };
}

module.exports = views;
