exports.up = function(knex) {
    return knex.schema.createTable("submissions", function(t) {
        t.string("id", 26).notNullable().primary();
        t.string("form_id", 26).notNullable().references("id").inTable("forms");
        t.text("email").notNullable();
        t.jsonb("data").notNullable();
        t.timestamp("created").notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("submissions");
};
