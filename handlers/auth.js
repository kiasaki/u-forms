async function login(ctx) {
    const data = {};

    if (ctx.method === "POST") {
        const email = data.email = ctx.request.body.email;
        const password = ctx.request.body.password;

        if (!email || email.indexOf("@") === -1) {
            data.error = "That doesn't look like a valid email.";
        } else if (!password || password.length < 8) {
            data.error = "A valid password must have 8 or more characters";
        } else {
            // Create user
        }
    }

    await ctx.render("login", data);
}

async function signup(ctx) {
    await ctx.render("index");
}

async function reset(ctx) {
    await ctx.render("index");
}

async function signout(ctx) {
    // Delete auth token
    ctx.redirect("/");
}

module.exports = {
    login,
    signup,
    reset,
    signout,
};
