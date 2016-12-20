const path = require("path");
const koa = require("koa");
const views = require("co-views");
const log = require("./library/logger").log;

const app = koa();
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
app.context.render = views(path.join(__dirname, "/views"), {ext: "html",});

app.on("error", function(err) {
    log("error", "server error", err);
});

app.use(function*(next) {
    var start = new Date;
    yield next;
    var ms = new Date - start;
    log("info", "request", {method: this.method, url: this.url, ms,});
});

app.use(function*() {
    this.body = "Hello World";
});

app.listen(config.get("port"));
log("info", "app started on port " + config.get("port"));
