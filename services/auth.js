const bcrypt = require("bcrypt");
const promisify = require("../library/promisify");

class AuthService {
    constructor(config) {
        this.config = config;
    }

    async hashPassword(password) {
        const passwordSecret = this.config.get("password_secret");
        return await promisify(bcrypt.hash)(password, passwordSecret);
    }

    async verifyPassword(password, passwordHash) {
        return await promisify(bcrypt.compare)(password, passwordHash);
    }
}

AuthService.dependencyName = "services:auth";
AuthService.dependencies = ["config",];

module.exports = AuthService;
