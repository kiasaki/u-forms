class MarketingController {
    async index(ctx) {
        await ctx.render("marketing/index");
    }

    async about(ctx) {
        await ctx.render("marketing/about");
    }
}

MarketingController.dependencies = [];

module.exports = MarketingController;
