const path = require("path");
const knex = require("knex");
const humps = require("humps");
const log = require("./logger").log;

class DB {
    constructor(config) {
        const knexfilePath = path.join(config.get("root"), "knexfile.js");
        this.knex = knex(require(knexfilePath)).on("query", this.loggingFn(config));
    }

    loggingFn(config) {
        return function dbLoggingFn(data) {
            const logData = {query: data.sql,};
            if (config.get("node_env") !== "production") {
                logData.bindings = data.bindings;
            }

            log("debug", "sql", logData);
        };
    }

    async findWhere(Entity, where) {
        const data = await this.knex
            .select()
            .from(Entity.table)
            .where(humps.decamelizeKeys(where))
            .limit(1);

        if (data && data.length > 0) {
            return new Entity(humps.camelizeKeys(data[0]));
        } else {
            return null;
        }
    }
}

DB.dependencyName = "db";
DB.dependencies = ["config",];

module.exports = DB;
