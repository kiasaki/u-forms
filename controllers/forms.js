const validator = require("../library/validator");
const Form = require("../entities/form");

class FormsController {
    constructor(formService) {
        this.formService = formService;

        this.create = this.create.bind(this);
    }

    async index(ctx) {
        await ctx.render("forms/index");
    }

    async create(ctx) {
        const data = {notify: true};

        if (ctx.method === "POST") {
            // Checkboxes are ommited in body when unchecked
            data.notify = "notify" in ctx.request.body;
            data.name = ctx.request.body.name;

            const errors = validator.validate([
                ["name", data.name, "required"],
            ]);

            if (errors.length > 0) {
                data.errors = errors;
            } else {
                // Create form and redirect to it
                const form = await this.formService.create(new Form({
                    userId: ctx.currentUser.id,
                    name: data.name,
                    notify: data.notify,
                    email: null,
                }));
                ctx.redirect(`/forms/${form.id}`);
                return;
            }
        }

        await ctx.render("forms/create", data);
    }
}

FormsController.dependencies = ["services:form"];

module.exports = FormsController;
