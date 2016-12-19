const koa = require("koa");

const log = require("./library/logger").log;

const NEW_SECRET = process.env.NEW_SECRET || "keyboardcat";
const OLD_SECRET = process.env.OLD_SECRET || "keyboardcat";

const app = koa();
app.keys = [NEW_SECRET, OLD_SECRET,];

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

const port = process.env.PORT || 3000;
app.listen(port);
log("info", "app started on port " + port);
