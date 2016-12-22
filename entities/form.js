const Entity = require("../library/entity");

class Form extends Entity {
}

Form.table = "forms";
Form.prototype.defaults = {
    created: Entity.newDate,
    updated: Entity.newDate,
};
Form.prototype.fields = [
    "id",
    "userId",
    "name",
    "notify",
    "email",
    "created",
    "updated",
];

module.exports = Form;
