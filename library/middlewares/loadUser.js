async function loadUserMiddleware(ctx, next) {
    const userId = ctx.cookies.get("session_user_id");
    const userService = ctx.container.get("services:user");

    if (userId) {
        ctx.currentUser = await userService.findById(userId);
    }

    await next();
}

module.exports = loadUserMiddleware;
