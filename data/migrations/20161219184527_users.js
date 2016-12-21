exports.up = function(knex) {
    return knex.schema.createTable("users", function(t) {
        t.string("id", 26).notNullable().primary();
        t.text("name").notNullable();
        t.text("email").notNullable().unique();
        t.text("password").notNullable();
        t.timestamp("created").notNullable().defaultTo(knex.fn.now());
        t.timestamp("updated").notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("users");
};
