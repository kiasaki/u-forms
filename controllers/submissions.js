const Submission = require("../entities/submission");

class SubmissionsController {
    constructor(mailerService, formService, submissionService) {
        this.mailerService = mailerService;
        this.formService = formService;
        this.submissionService = submissionService;

        this.create = this.create.bind(this);
    }

    async create(ctx) {
        const data = ctx.request.body;
        const email = data.email || data._email || this.config.get("app_email");

        console.log();

        // Spam check/filtering missing?
        if (data._bot && data._bot.length > 0) {
            await ctx.render("error/500");
            return;
        }

        // Fetch the associated form
        //  - to make sure it exists
        //  - to know if we need to notify the owner via email
        const form = await this.formService.findById(ctx.params.id);
        if (!form) {
            // Stop right here if we can't find associated form
            await ctx.render("error/404");
            return;
        }

        // Save the submission
        const submission = await this.submissionService.create(new Submission({
            formId: form.id,
            email,
            data,
        }));

        // Email notification (if enabled)
        if (false && form.notify) {
            await this.mailerService.send({
                to: form.email,
                from: email,
                subject: `[uForms] ${form.name}`,
                templateName: "mails/new-submission",
                templateData: {form, submission},
            });
        }

        // In the case the owner wanted to send the user back to a specific URL
        if (data._next) {
            ctx.redirect(data._next);
            return;
        }

        ctx.redirect(`/thank-you?referer=${ctx.get("referer")}`);
    }

    async thankYou(ctx) {
        await ctx.render("submissions/thank-you", {
            referer: ctx.query.referer,
        });
    }
}

SubmissionsController.dependencies = ["services:mailer", "services:form", "services:submission"];

module.exports = SubmissionsController;
