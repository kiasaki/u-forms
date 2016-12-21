const User = require("../entities/user");

class UserService {
    constructor(db) {
        this.db = db;
    }

    async findByEmail(email) {
        return await this.db.findWhere(User, {email,});
    }
}

UserService.dependencyName = "services:user";
UserService.dependencies = ["db",];

module.exports = UserService;

