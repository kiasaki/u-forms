async function requireUserMiddleware(ctx, next) {
    if (!ctx.currentUser) {
        ctx.redirect("/login");
        return;
    }

    await next();
}

module.exports = requireUserMiddleware;
