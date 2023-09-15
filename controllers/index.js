const homeRouter = require('./home');
const userRouter = require('./user');
const articleRouter = require('./article');
const roleRouter = require('./role');
const permissionRouter = require('./permission');
const adminRouter = require('./admin');
const tagRouter = require('./tag');

module.exports = {
    homeRouter,
    userRouter,
    articleRouter,
    roleRouter,
    permissionRouter,
    adminRouter,
    tagRouter
};