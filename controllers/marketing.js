class MarketingController {
    async index(ctx) {
        await ctx.render("index");
    }

    async about(ctx) {
        await ctx.render("about");
    }
}

MarketingController.dependencies = [];

module.exports = MarketingController;
