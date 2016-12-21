const path = require("path");
const knex = require("knex");
const ulid = require("ulid");
const humps = require("humps");
const log = require("./logger").log;

class DB {
    constructor(config) {
        const knexfilePath = path.join(config.get("root"), "knexfile.js");
        this.knex = knex(require(knexfilePath)).on("query", this.loggingFn(config));
    }

    loggingFn(config) {
        return function dbLoggingFn(data) {
            const logData = {query: data.sql};
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

        if (!data || data.length === 0) {
            return null;
        }
        return new Entity(humps.camelizeKeys(data[0]));
    }

    async create(Entity, entity) {
        // Assign a new id
        entity.id = ulid();

        const data = await this.knex
            .into(Entity.table)
            .insert(humps.decamelizeKeys(entity.toObject()))
            .returning("*");

        return new Entity(humps.camelizeKeys(data[0]));
    }
}

DB.dependencyName = "db";
DB.dependencies = ["config"];

module.exports = DB;
