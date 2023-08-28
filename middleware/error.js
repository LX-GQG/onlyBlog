// 全局统一错误处理
const error = () => {
    return async (ctx, next) => {
        try {
            await next();
        } catch (error) {
            if (error.code) {
                // 自己主动抛出的错误
                ctx.fail({ code: error.code, msg: error.message });
            } else {
                // 程序运行时的错误
                ctx.app.emit("error", error, ctx);
            }
        }
    };
};

module.exports = error;