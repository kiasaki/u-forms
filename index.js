const path = require("path");
const Koa = require("koa");
const log = require("./library/logger").log;

const app = new Koa();
const container = app.context.container = require("./container");

// Load config & set defaults
const config = container.load(require("./library/config"));
config.load({
    port: 3000,
    new_secret: "keywordcat",
    old_secret: "keywordcat",
    jwt_secret: "beeeeeeees",
});
config.set("root", __dirname);
config.loadFromEnv();

// Load helpers and services
container.load(require("./library/jwt"));

// Configure application
app.keys = [config.get("new_secret"), config.get("old_secret"),];
app.use(require("./library/middlewares/views")({
    root: path.join(__dirname, "views"),
    engineName: "hogan",
    options: {
        partials: {
            header: "includes/header",
            footer: "includes/footer",
        },
    },
}));
app.use(require("./library/middlewares/static")("static"));

app.on("error", function(err) {
    log("error", "server error", {error: err.message, stack: err.stack,});
});

app.use(async function(ctx, next) {
    var start = new Date;
    await next();
    var ms = new Date - start;
    log("info", "request", {method: ctx.method, url: ctx.url, ms,});
});

app.use(async function(ctx) {
    await ctx.render("index", {
        message: "m",
    });
});

app.listen(config.get("port"));
log("info", "app started on port " + config.get("port"));
