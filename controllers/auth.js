const validator = require("../library/validator");
const User = require("../entities/user");

const maxAge = 1000 * 60 * 60 * 24 * 7; // 1 week (in miliseconds)

class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;

        this.login = this.login.bind(this);
        this.signup = this.signup.bind(this);
        this.reset = this.reset.bind(this);
    }

    async login(ctx) {
        const data = {};

        if (ctx.method === "POST") {
            const {email, password,} = ctx.request.body;
            const user = await this.userService.findByEmail(email);

            let passwordMatches = false;
            if (user && password) {
                // Only verify password when we have a password and found a user
                passwordMatches = await this.authService.verifyPassword(password, user.password);
            }

            if (!user || !passwordMatches) {
                data.email = email;
                data.errors = ["Incorrect username or password.",];
            } else {
                // Set session token
                ctx.cookies.set("session_user_id", user.id, {signed: true, maxAge,});
                // Redirect
                ctx.redirect("/");
            }
        }

        await ctx.render("login", data);
    }

    async signup(ctx) {
        let data = {};

        if (ctx.method === "POST") {
            const {name, email, password,} = ctx.request.body;
            const errors = validator.validate([
                ["name", name, "required",],
                ["email", email, "required", "email", ["min", 6,],],
                ["password", password, "required", ["min", 8,],],
            ]);

            // Now check for duplicate emails too
            const duplicateUser = await this.userService.findByEmail(email);
            if (duplicateUser) {
                errors.push("This email is already in use.");
            }

            if (errors.length > 0) {
                data = {name, email, errors,};
            } else {
                let user = new User({name, email, password,});
                // Hash password
                user.password = await this.authService.hashPassword(user.password);
                // Create user
                user = await this.userService.create(user);
                // Set session token
                ctx.cookies.set("session_user_id", user.id, {signed: true, maxAge,});
                // Redirect
                ctx.redirect("/forms/create");
            }
        }

        await ctx.render("signup", data);
    }

    async reset(ctx) {
        await ctx.render("reset");
    }

    async signout(ctx) {
        // Delete auth token
        ctx.cookies.set("session_user_id", null, {overwrite: true,});
        ctx.redirect("/");
    }
}

AuthController.dependencies = ["services:auth", "services:user",];

module.exports = AuthController;
