class FormsController {
    async create(ctx) {
        await ctx.render("forms/create");
    }
}

FormsController.dependencies = [];

module.exports = FormsController;
