const path = require('path');
const log4js = require('log4js');

log4js.configure({
    // 日志记录方式
    appenders: {
        error: {
            type: 'file',
            filename: path.join('logs/', 'error/error.log'),
            maxLogSize: 10485760,
            backups: 100,
            compress: true
        },
        response: {
            type: 'dateFile',
            filename: path.join('logs/', 'access/response'),
            pattern: 'yyyy-MM-dd.log', // 日志按天分割
            alwaysIncludePattern: true,
            maxLogSize: 10485760,
            backups: 100,
            compress: true
        },
        console: {
            type: 'console',
            layout: {
                type: 'pattern',
            }
        },
    },
    categories: {
        error: { appenders: ['error'], level: 'error' },
        response: { appenders: ['response'], level: 'info' },
        default: { appenders: ['console'], level: 'all' }
    },
    replaceConsole: true
});

let logger = {}

// 自定义输出格式，确定哪些内容输出到日志文件中
const formatError = (ctx, err) => {
    const { method, url } = ctx
    // body可能不存在, request.body可能不存在
    const body = ctx?.request?.body || {}
    const user = ctx?.state?.user || {}
    // 将请求方法，请求路径，请求体，登录用户，错误信息
    return { method, url, body, user, err }
}


const formatRes = (ctx, costTime) => {
    // const { method, url, response: { status, message, body: { success } }, request: { header: { authorization } } } = ctx
    const { ip, method, url, response: { status, message }, request: { header: { authorization } } } = ctx
    const body = ctx.request.body
    const user = ctx.state.user
    // 将请求方法，请求路径，请求体，登录用户，请求消耗时间，请求头中的authorization字段即token，响应体中的状态码，消息，以及自定义的响应状态
    return { ip, method, url, body, user, costTime, authorization, response: { status, message } }
}

// 生成一个error类型的日志记录器
let errorLogger = log4js.getLogger('error')

// 生成一个response类型的日志记录器
let resLogger = log4js.getLogger('response')

// 生成一个控制台类型的日志记录器
let console = log4js.getLogger()

// 封装错误日志
logger.errLogger = (ctx, error) => {
    if (ctx && error) {
        errorLogger.error(formatError(ctx, error))
    }
}

// 封装响应日志
logger.resLogger = (ctx, resTime) => {
    if (ctx) {
        resLogger.info(formatRes(ctx, resTime))
    }
}

// 控制台输出
logger.log = console

module.exports = logger