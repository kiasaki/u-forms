const postmark = require("postmark");
const promisify = require("../library/promisify");

class PostmarkMailer {
    constructor(config) {
        const apiToken = config.get("postmark_api_token");
        this.client = new postmark.Client(apiToken);
    }

    send(spec) {
        const email = {
            From: spec.from,
            To: spec.to,
            Subject: spec.subject,
            TextBody: spec.contentPlain,
            HtmlBody: spec.contentHtml,
        };

        if (spec.replyTo) {
            email.ReplyTo = spec.replyTo;
        }

        return promisify(this.client.sendEmail.bind(this.client))(email);
    }
}

module.exports = PostmarkMailer;
