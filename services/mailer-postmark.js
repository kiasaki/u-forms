const postmark = require("postmark");
const promisify = require("../library/promisify");

class PostmarkMailer {
    constructor(config) {
        const apiToken = config.get("postmark_api_token");
        this.client = new postmark.Client(apiToken);
    }

    send(spec) {
        return promisify(this.client.sendEmail.bind(this.client))({
            From: spec.from,
            To: spec.to,
            Subject: spec.subject,
            TextBody: spec.contentPlain,
        });
    }
}

module.exports = PostmarkMailer;
