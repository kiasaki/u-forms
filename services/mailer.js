const path = require("path");
const consolidate = require("consolidate");
const ConsoleMailer = require("./mailer-console");
const PostmarkMailer = require("./mailer-postmark");

class MailerService {
    constructor(config) {
        this.config = config;

        switch (config.get("mailer_implementation")) {
        case "console":
            this.mailerImplementation = new ConsoleMailer(config);
            break;
        case "postmark":
            this.mailerImplementation = new PostmarkMailer(config);
            break;
        default:
            throw new Error(
                "mailer: unknown mailer implementation: " + config.get("mailer_implementation")
            );
        }
    }

    async send(spec) {
        const viewPath = path.join(this.config.get("root"), "data", "emails", spec.templateName);
        spec.contentPlain = await consolidate.hogan(viewPath + ".txt", spec.templateData);
        spec.contentHtml = await consolidate.hogan(viewPath + ".html", spec.templateData);

        return await this.mailerImplementation.send(spec);
    }
}

MailerService.dependencyName = "services:mailer";
MailerService.dependencies = ["config"];

module.exports = MailerService;
