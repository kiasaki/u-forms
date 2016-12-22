const moment = require("moment");
const Form = require("../entities/form");

class FormService {
    constructor(db) {
        this.db = db;
    }

    findById(id) {
        return this.db.findWhere(Form, {id});
    }

    findForUser(userId) {
        return this.db.findAllWhere(Form, {userId}, {
            orderBy: "-updated",
        });
    }

    create(entity) {
        return this.db.create(Form, entity);
    }

    update(entity) {
        entity.updated = moment().utc().toDate();
        return this.db.update(Form, entity);
    }

    destroy(entityId) {
        return this.db.destroy(Form, entityId);
    }
}

FormService.dependencyName = "services:form";
FormService.dependencies = ["db"];

module.exports = FormService;
