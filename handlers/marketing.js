async function index(ctx) {
    await ctx.render("index");
}

async function about(ctx) {
    await ctx.render("about");
}

module.exports = {
    index,
    about,
};
