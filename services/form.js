const Form = require("../entities/form");

class FormService {
    constructor(db) {
        this.db = db;
    }

    async findById(id) {
        return await this.db.findWhere(Form, {id});
    }

    async create(entity) {
        return await this.db.create(Form, entity);
    }
}

FormService.dependencyName = "services:form";
FormService.dependencies = ["db"];

module.exports = FormService;
