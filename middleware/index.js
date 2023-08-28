const koaBodyParser = require('koa-bodyparser');
const myKoaBodyParser = koaBodyParser();

const response = require('./response');
const myResponse = response();

const error = require('./error');
const myErrorHandler  = error();

// 跨域
const koaCors = require('koa2-cors');
const myKoaCors = koaCors({
    origin: '*',
    credentials: true,
    allowHeaders: ["GET","HEAD","PUT","POST","DELETE","PATCH","OPTIONS"],
});

// 日志
const logger = require('koa-logger');
const myLogger = logger();


module.exports = [
    myKoaBodyParser,
    myResponse,
    myErrorHandler,
    myKoaCors,
    myLogger
];