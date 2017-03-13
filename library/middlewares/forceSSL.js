async function forceSSL(ctx, next) {
    const config = ctx.container.get("config");

    if (!ctx.secure && config.get("force_ssl")) {
        ctx.redirect("https://" + config.get("app_base_url") + ctx.path);
        return;
    }

    await next();
}

module.exports = forceSSL;
