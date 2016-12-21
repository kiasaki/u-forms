class FormsController {
    async index(ctx) {
        await ctx.render("forms/index");
    }

    async create(ctx) {
        const data = {notify: true,};

        if (ctx.method === "POST") {
            data.notify = false;
        }

        await ctx.render("forms/create", data);
    }
}

FormsController.dependencies = [];

module.exports = FormsController;
