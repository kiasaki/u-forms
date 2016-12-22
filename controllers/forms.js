const validator = require("../library/validator");
const Form = require("../entities/form");

class FormsController {
    constructor(formService, submissionService) {
        this.formService = formService;
        this.submissionService = submissionService;

        this.create = this.create.bind(this);
        this.show = this.show.bind(this);
        this.edit = this.edit.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    async index(ctx) {
        const forms = await this.formService.findUserForms(ctx.currentUser.id);
        await ctx.render("forms/index", {forms});
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
                    email: ctx.currentUser.email,
                }));
                ctx.redirect(`/forms/${form.id}`);
                return;
            }
        }

        await ctx.render("forms/create", data);
    }

    async show(ctx) {
        const form = await this.formService.findById(ctx.params.id);
        ctx.assert(form, 404);
        ctx.assert(form.userId === ctx.currentUser.id, 404);

        await ctx.render("forms/show", {form});
    }

    async edit(ctx) {
        let errors = [];
        const form = await this.formService.findById(ctx.params.id);
        ctx.assert(form, 404);
        ctx.assert(form.userId === ctx.currentUser.id, 404);

        if (ctx.method === "POST") {
            form.notify = "notify" in ctx.request.body;
            form.name = ctx.request.body.name;

            errors = validator.validate([
                ["name", form.name, "required"],
            ]);

            if (errors.length === 0) {
                // Save form and redirect to it's "show" page
                await this.formService.update(form);
                ctx.redirect(`/forms/${form.id}`);
                return;
            }
        }

        await ctx.render("forms/edit", {form, errors});
    }

    async destroy(ctx) {
        const form = await this.formService.findById(ctx.params.id);
        ctx.assert(form, 404);
        ctx.assert(form.userId === ctx.currentUser.id, 404);

        if (ctx.method === "POST") {
            await this.submissionService.destroyFormSubmissions(form.id);
            await this.formService.destroy(form.id);
            ctx.redirect("/");
            return;
        }

        await ctx.render("forms/destroy", {form});
    }
}

FormsController.dependencies = ["services:form", "services:submission"];

module.exports = FormsController;
