const Entity = require("../library/entity");

class Submission extends Entity {
}

Submission.table = "submissions";
Submission.prototype.defaults = {
    created: Entity.newDate,
};
Submission.prototype.fields = [
    "id",
    "formId",
    "email",
    "data",
    "created",
];

module.exports = Submission;
