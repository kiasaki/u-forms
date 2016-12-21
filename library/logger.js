const util = require("util");

function log(level, message, extraArgs) {
    let logMessage = {level, message};

    if (typeof extraArgs === "object") {
        logMessage = Object.assign(logMessage, extraArgs);
    }

    if (process.stdout.isTTY) {
        const formattedMessage = util.inspect(logMessage, {colors: true})
            .replace(/\n/g, "")
            .replace(/ {2}/g, " ")
            .replace(/{ /g, "{")
            .replace(/ }/g, "}");
        console.log(formattedMessage);
    } else {
        console.log(JSON.stringify(logMessage));
    }
}

module.exports = {
    log,
};
