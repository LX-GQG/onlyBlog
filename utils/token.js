const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/config').tokenConfig.serect;
const tokenExpiresTime = require('../config/config').tokenConfig.expiresIn;

// 创建token
const createToken = (userinfo) => {
    const token = jwt.sign(userinfo, jwtSecret, { expiresIn: tokenExpiresTime });
    return token;
}

// 验证token
const checkToken = (token) => {
    return new Promise((resolve, reject) => {
        if(token === undefined) reject('token is undefined');
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                // 不同错误类型返回的错误信息不同
                if (err.name === 'JsonWebTokenError') {
                    // JWT 签名验证失败
                    reject('Token verification failed');
                } else if (err.name === 'TokenExpiredError') {
                    // JWT 已过期，你可以在这里处理过期情况
                    reject('Token expired');
                } else {
                    reject(err);
                    reject('Token verification failed');
                }
            } else {
                resolve(decoded);
            }
        })
    })
}



module.exports = {
    createToken,
    checkToken,
}
