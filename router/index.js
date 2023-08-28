const router = require('koa-router')();
const routeList = require('./router');

routeList.forEach((item) => {
    const { methods, path, controller, middleware } = item;
    // middleware可能没有
    if (middleware && middleware.length) {
        router[methods](path, ...middleware, controller);
        return;
    }else{
        router[methods](path, controller);
    }
    // router[methods](path, controller, ...middleware);
});

module.exports = router;