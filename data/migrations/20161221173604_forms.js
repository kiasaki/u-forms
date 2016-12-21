exports.up = function(knex) {
    return knex.schema.createTable("forms", function(t) {
        t.string("id", 26).notNullable().primary();
        t.string("user_id", 26).notNullable().references("id").inTable("users");
        t.text("name").notNullable();
        t.boolean("notify").notNullable().defaultTo(true);
        t.text("email");
        t.timestamp("created").notNullable().defaultTo(knex.fn.now());
        t.timestamp("updated").notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("forms");
};
