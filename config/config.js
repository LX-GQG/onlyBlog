// 数据库配置文件
const config = {
    database: {
        user: "root", //账号
        password: "7c9969396004fbd0", //密码
        database: "onlyblog", //数据库
        host: "120.76.205.83", //服务器地址或者自己的ip地址
        port: 3306, //数据库端口
        timezone: '+08:00'
    },
    // jwt配置参数
    tokenConfig: {
        serect: 'onlyBlog', //密钥
        expiresIn: '24h' //过期时间
    }
};


module.exports = config;