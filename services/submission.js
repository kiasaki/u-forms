const Submission = require("../entities/submission");

class SubmissionService {
    constructor(db) {
        this.db = db;
    }

    findById(id) {
        return this.db.findWhere(Submission, {id});
    }

    create(entity) {
        return this.db.create(Submission, entity);
    }

    destroy(entityId) {
        return this.db.destroy(Submission, entityId);
    }

    destroyFormSubmissions(formId) {
        return this.db.knex(Submission.table)
            .where({form_id: formId})
            .del();
    }
}

SubmissionService.dependencyName = "services:submission";
SubmissionService.dependencies = ["db"];

module.exports = SubmissionService;
