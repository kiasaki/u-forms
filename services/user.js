const User = require("../entities/user");

class UserService {
    constructor(db) {
        this.db = db;
    }

    async findById(id) {
        return await this.db.findWhere(User, {id});
    }

    async findByEmail(email) {
        return await this.db.findWhere(User, {email});
    }

    async create(entity) {
        return await this.db.create(User, entity);
    }
}

UserService.dependencyName = "services:user";
UserService.dependencies = ["db"];

module.exports = UserService;
