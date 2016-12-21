const validator = require("../library/validator");
const User = require("../entities/user");

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
                const maxAge = 1000 * 60 * 60 * 24 * 7; // 1 week (in miliseconds)
                ctx.cookies.set("session_user_id", user.id, {signed: true, maxAge,});
                // Redirect
                ctx.redirect("/");
            }
        }

        await ctx.render("login", data);
    }

    async signup(ctx) {
        const data = {};

        if (ctx.method === "POST") {
            const {email, password,} = ctx.request.body;
            const errors = validator.validate([
                ["email", email, "required", "email", ["min", 6,],],
                ["password", password, "required", ["min", 8,],],
            ]);

            if (errors.length > 0) {
                data.email = email;
                data.errors = errors;
            } else {
                // Create user
                await this.userService.create(new User({
                    email, password,
                }));
            }
        }

        await ctx.render("signup", data);
    }

    async reset(ctx) {
        await ctx.render("index");
    }

    async signout(ctx) {
        // Delete auth token
        ctx.redirect("/");
    }
}

AuthController.dependencies = ["services:auth", "services:user",];

module.exports = AuthController;
