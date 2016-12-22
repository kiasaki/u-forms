class ConsoleMailer {
    send(spec) {
        console.log("== EMAIL ================================");
        console.log(`From: ${spec.from}`);
        console.log(`To: ${spec.to}`);
        console.log(`Subject: ${spec.subject}`);
        console.log();
        console.log(spec.contentPlain);
        console.log("=========================================");

        return Promise.resolve();
    }
}

module.exports = ConsoleMailer;


