async function globalTemplateStateMiddleware(ctx, next) {
    const config = ctx.container.get("config");
    ctx.state.app_name = config.get("app_name");
    ctx.state.app_base_url = config.get("app_base_url");
    await next();
}

module.exports = globalTemplateStateMiddleware;
