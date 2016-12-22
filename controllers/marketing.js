class MarketingController {
    constructor(container) {
        this.formsController = container.create(require("./forms"));

        this.index = this.index.bind(this);
    }

    async index(ctx) {
        if (ctx.currentUser) {
            // If the user is logged in, show forms list
            await this.formsController.index(ctx);
            return;
        }

        await ctx.render("marketing/index");
    }

    async about(ctx) {
        await ctx.render("marketing/about");
    }

    async test(ctx) {
        await ctx.render("marketing/test");
    }
}

MarketingController.dependencies = ["container"];

module.exports = MarketingController;
