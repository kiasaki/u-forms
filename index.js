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
    root: __dirname,
    app_name: "μForms",
    app_base_url: "localhost:3000",
    new_secret: "keywordcat",
    old_secret: "keywordcat",
    password_secret: "beeeeeeees",
});
config.loadFromEnv();

// Load helpers and services in container
container.set("container", container);
container.load(require("./library/db"));
container.load(require("./library/jwt"));
container.load(require("./services/auth"));
container.load(require("./services/user"));

// Pre-Request Middlewares
app.keys = [config.get("new_secret"), config.get("old_secret"),];
app.use(require("./library/middlewares/globalTemplateState"));
app.use(require("./library/middlewares/errorHandler"));
app.use(require("./library/middlewares/views")({
    root: path.join(__dirname, "views"),
    engineName: "hogan",
    options: {
        partials: {
            header: path.join("../includes", "header"),
            footer: path.join("../includes", "footer"),
        },
    },
}));
app.use(require("./library/middlewares/static")("static"));
app.use(require("./library/middlewares/requestLogger"));
app.use(require("./library/middlewares/loadUser"));

const requireUser = require("./library/middlewares/requireUser");

// Routes
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

const formsController = container.create(require("./controllers/forms"));
router.get("/forms/create", koaBody, requireUser, formsController.create);

// Post-Request Middlewares
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async function(ctx) {await ctx.render("404");});

if (!module.parent) {
    app.listen(config.get("port"));
    log("info", "app started on port " + config.get("port"));
}
