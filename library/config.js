const R = require("ramda");
const log = require("./logger").log;

class Config {
    constructor() {
        this.config = {};
    }

    get(key, defaul) {
        return this.config[key] || defaul;
    }

    set(key, value) {
        this.config[key] = value;
    }

    unset(key) {
        delete this.config[key];
    }

    reset() {
        this.config = {};
    }

    load(values) {
        this.config = R.merge(this.config, values);
    }

    loadFromEnv() {
        log("info", "config: loading from env");
        R.forEach(envKey => {
            this.set(envKey.toLowerCase(), process.env[envKey]);
        }, R.keys(process.env));
    }
}

Config.dependencyName = "config";
Config.dependencies = [];

module.exports = Config;
