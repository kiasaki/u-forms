const path = require("path");
const knex = require("knex");

class DB {
    constructor(config) {
        const knexfilePath = path.join(config.get("root"), "knexfile.js");
        this.kx = knex(require(knexfilePath));
    }
}

DB.dependencyName = "db";
DB.dependencies = ["config",];

module.exports = DB;
