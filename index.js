const path = require("path");
const Koa = require("koa");
const koaBody = require("koa-body")();
const log = require("./library/logger").log;

const app = new Koa();
const container = app.context.container = require("./container");
const router = app.context.router = require("koa-router")();

// Load config & set defaults
const config = container.load(require("./library/config"));
config.load({
    port: 3000,
    app_name: "μForms",
    app_base_url: "localhost:3000",
    new_secret: "keywordcat",
    old_secret: "keywordcat",
    password_secret: "beeeeeeees",
});
config.set("root", __dirname);
config.loadFromEnv();

// Load helpers and services
container.load(require("./library/db"));
container.load(require("./library/jwt"));
container.load(require("./services/auth"));
container.load(require("./services/user"));

// Configure application
app.keys = [config.get("new_secret"), config.get("old_secret"),];
app.use(async function(ctx, next) {
    ctx.state.app_name = config.get("app_name");
    ctx.state.app_base_url = config.get("app_base_url");
    await next();
});
app.use(async function(ctx, next) {
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
});
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

app.use(async function(ctx, next) {
    var start = new Date;
    await next();
    var ms = new Date - start;
    log("info", "request", {method: ctx.method, url: ctx.url, ms,});
});

const marketingController = container.create(require("./controllers/marketing"));
router.get("/", marketingController.index);
router.get("/about", marketingController.about);

const authController = container.create(require("./controllers/auth"));
router.get("/login", authController.login);
router.post("/login", koaBody, authController.login);
router.get("/signup", authController.signup);
router.post("/signup", koaBody, authController.signup);
router.get("/reset", authController.reset);
router.post("/reset", koaBody, authController.reset);
router.get("/signout", authController.signout);

app.use(router.routes());
app.use(router.allowedMethods());
app.use(async function(ctx) {await ctx.render("404");});

if (!module.parent) {
    app.listen(config.get("port"));
    log("info", "app started on port " + config.get("port"));
}
