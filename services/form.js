const Form = require("../entities/form");

class FormService {
    constructor(db) {
        this.db = db;
    }

    findById(id) {
        return this.db.findWhere(Form, {id});
    }

    findUserForms(userId) {
        return this.db.findAllWhere(Form, {userId}, {
            orderBy: "-updated",
        });
    }

    create(entity) {
        return this.db.create(Form, entity);
    }
}

FormService.dependencyName = "services:form";
FormService.dependencies = ["db"];

module.exports = FormService;
