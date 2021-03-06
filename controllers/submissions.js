const {fromPairs, toPairs, filter} = require("ramda");
const Submission = require("../entities/submission");

const keyDoesntStartWithUnderscore = ([k]) => k[0] !== "_";

class SubmissionsController {
    constructor(config, mailerService, formService, submissionService) {
        this.config = config;
        this.mailerService = mailerService;
        this.formService = formService;
        this.submissionService = submissionService;

        this.create = this.create.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    async create(ctx) {
        const data = ctx.request.body;
        const email = data.email || data._email || this.config.get("app_email");

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
            email: email,
            data: fromPairs(filter(keyDoesntStartWithUnderscore, toPairs(data))),
        }));

        // Email notification (if enabled)
        if (form.notify) {
            await this.mailerService.send({
                to: form.email,
                from: this.config.get("app_email"),
                replyTo: email,
                subject: `[uForms] ${form.name}`,
                templateName: "new-submission",
                templateData: {
                    app_base_url: ctx.state.app_base_url,
                    form,
                    submission,
                    dataPairs: toPairs(submission.data),
                },
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

    async destroy(ctx) {
        const submission = await this.submissionService.findById(ctx.params.id);
        ctx.assert(submission, 404);

        // We need to fetch to form associated to the submission
        // to make sure this user has the rights to delete this submission
        const form = await this.formService.findById(submission.formId);
        ctx.assert(form, 404);
        ctx.assert(form.userId === ctx.currentUser.id, 404);

        // Delete it
        await this.submissionService.destroy(submission.id);

        ctx.redirect(`/forms/${form.id}#submissions`);
    }
}

SubmissionsController.dependencies = ["config", "services:mailer", "services:form", "services:submission"];

module.exports = SubmissionsController;
