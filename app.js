const Koa = require("koa");
const compose = require("koa-compose");
const koaStatic = require("koa-static");
const checkTokenMiddleware = require("./utils/auth").checkTokenMiddleware;

const middleware = require("./middleware");
const koajwt = require('koa-jwt');
const jwtSecret = require('./config/config').tokenConfig.serect;

// https
const https = require('https');
const fs = require('fs');
const { default: enforceHttps } = require('koa-sslify');

const { koaBody } = require('koa-body');
const router = require("./router");

const cors = require('koa2-cors');
const path = require('path');

// 日志
const { log, errLogger, resLogger } = require('./utils/log4');

const app = new Koa();

// Force HTTPS on all page
app.use(enforceHttps({
    trustProtoHeader: true
}));

app.use(koaStatic(__dirname + "/public"));
app.use(koaBody({
    multipart: true, // 支持文件上传
    formidable: {
        uploadDir: path.join(__dirname, "public/upload"), // 设置文件上传目录
        maxFileSize: 300 * 1024 * 1024,    // 设置上传文件大小最大限制，默认3M
        keepExtensions: true,              // 保持文件的后缀
    }
}));

app.use(cors({
    origin: function (ctx) {
        // 设置允许来自指定域名请求
        // if (ctx.url == 'http://localhost:5173') {
        //     return "*"; // 允许来自所有域名请求
        // }
        return "*"; // 允许来自所有域名请求
        // return ctx.header.origin; //允许ctx.header.origin这个域名的请求
    },
    credentials: true, //是否允许发送Cookie
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //设置所允许的HTTP请求方法
    allowHeaders: ["Content-Type", "Authorization", "Accept","x-requested-with"], //设置服务器支持的所有头信息字段
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"] //设置获取其他自定义字段
}));

// 中间件
app.use(compose(middleware));
app.use(checkTokenMiddleware)

// 不需要验证的接口
app.use(koajwt({ secret: jwtSecret }).unless({
    path: [
        // 前台接口
        /^\/api/,
        // 登录接口
        /^\/admin\/login/,
        // 注册接口
        // /^\/api\/register/,
        // 访问静态资源
        /^\/public/,
        /^\/upload/,
        // /^((?!\/api\/).)*$/ // 除了私有接口，其他都可以访问
    ]
}));

// 日志
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const end = new Date() - start;

    resLogger(ctx, end);
    console.log(`${ctx.method} ${ctx.url} - ${end}ms`);
})

app.on('error', (err, ctx) => {
    errLogger(err, ctx);
    console.log(err);
})

app.use(router.routes(),router.allowedMethods());


// 端口号
const port = 3658;

const options = {
    key: fs.readFileSync('./ssl/www.gqgwr.cn.key'),
    cert: fs.readFileSync('./ssl/www.gqgwr.cn.pem'),
}

https.createServer(options, app.callback()).listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
// 因为开启https chorme会报错，只需要在地址栏输入：chrome://flags/#allow-insecure-localhost，然后将Insecure origins treated as secure中的Disabled改为Enabled即可。
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// });