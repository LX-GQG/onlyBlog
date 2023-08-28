// 封装统一返回数据
const response = () => {
    return async (ctx, next) => {
        ctx.fail = ({ code, msg, data }) => {
            ctx.body = {
                code: code || 1001,
                msg: msg || 'fail',
                data
            }
        }
        ctx.success = ({ code, msg, data }) => {
            ctx.body = {
                code: code || 200,
                msg: msg || 'success',
                data
            }
        }
        await next()
    }
}

module.exports = response