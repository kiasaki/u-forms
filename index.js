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
    app_email: "hi@uforms.kiasaki.com",
    new_secret: "keyboardcat",
    old_secret: "keyboardcat",
    password_secret: "beeeeeeees",
    mailer_implementation: "console",
    postmark_api_token: "", // used in prod with the "postmark" mailer
});
config.loadFromEnv();

// Load helpers and services in container
container.set("container", container);
container.load(require("./library/db"));
container.load(require("./library/jwt"));
container.load(require("./services/mailer"));
container.load(require("./services/auth"));
container.load(require("./services/user"));
container.load(require("./services/form"));
container.load(require("./services/submission"));

// Pre-Request Middlewares
app.proxy = true;
app.keys = [config.get("new_secret"), config.get("old_secret")];
app.use(require("./library/middlewares/forceSSL"));
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
router.get("/test", marketingController.test);

const authController = container.create(require("./controllers/auth"));
router.get("/login", authController.login);
router.post("/login", koaBody, authController.login);
router.get("/signup", authController.signup);
router.post("/signup", koaBody, authController.signup);
router.get("/reset", authController.reset);
router.post("/reset", koaBody, authController.reset);
router.get("/signout", authController.signout);

const formsController = container.create(require("./controllers/forms"));
router.get("/forms/create", requireUser, formsController.create);
router.post("/forms/create", koaBody, requireUser, formsController.create);
router.get("/forms/:id([A-Z0-9]{26})", requireUser, formsController.show);
router.get("/forms/:id([A-Z0-9]{26})/edit", requireUser, formsController.edit);
router.post("/forms/:id([A-Z0-9]{26})/edit", koaBody, requireUser, formsController.edit);
router.get("/forms/:id([A-Z0-9]{26})/destroy", requireUser, formsController.destroy);
router.post("/forms/:id([A-Z0-9]{26})/destroy", koaBody, requireUser, formsController.destroy);

const submissionsController = container.create(require("./controllers/submissions"));
router.post("/f/:id([A-Z0-9]{26})", koaBody, submissionsController.create);
router.get("/thank-you", submissionsController.thankYou);
router.get("/submissions/:id([A-Z0-9]{26})/destroy", koaBody, requireUser, submissionsController.destroy);

const usersController = container.create(require("./controllers/users"));
router.get("/settings", requireUser, usersController.edit);
router.post("/settings", koaBody, requireUser, usersController.edit);
router.get("/users/destroy", requireUser, usersController.destroy);
router.post("/users/destroy", koaBody, requireUser, usersController.destroy);

const challengeKey = "b-WShsj_gMbvAbUV75XGCoEN6Tn5X9DSbXgOyKae1cU";
router.get(`/.well-known/acme-challenge/${challengeKey}`, function(ctx) {
    ctx.body = process.env.LETS_ENCRYPT_CHALLENGE || 'not set';
});

// Post-Request Middlewares
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async function(ctx) {await ctx.render("error/404");});

if (!module.parent) {
    app.listen(config.get("port"));
    log("info", "app started on port " + config.get("port"));
}
