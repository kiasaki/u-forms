exports.up = function(knex) {
    return knex.schema.createTable("users", function(t) {
        t.increments();
        t.text("name");
        t.text("email");
        t.text("password");
        t.timestamps(true);

        t.unique("email");
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("users");
};
