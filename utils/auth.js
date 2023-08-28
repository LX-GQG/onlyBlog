// const jwt = require('jsonwebtoken');
const checkToken = require('./token').checkToken;
const jwtSecret = require('../config/config').tokenConfig.serect;
const jwt = require('jsonwebtoken');

// 需要登录权限的路由中间件
const checkTokenMiddleware = async (ctx, next) => {
    try {
        const authorization = ctx.header.authorization // 获取jwt
        if (authorization) {
            const token = authorization.split(' ')[1]
            let payload
            try {
                payload = await checkToken(token);  // 解密，获取payload           
                await next()
            } catch (err) {
                // console.log(err)
                ctx.fail({ code: 401, msg: err });  
            }
        } else {
            await next()
        }
    } catch (err) {
        if (err.status === 401) {
            ctx.fail({ code: 401, msg: '你没有权限访问' });
        } else {
            err.status = 200
            ctx.fail({ code: 401, msg: err.message });
        }
    }
}

module.exports = {
    checkTokenMiddleware
}