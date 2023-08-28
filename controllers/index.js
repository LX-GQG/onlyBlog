const homeRouter = require('./home');
const userRouter = require('./user');
const articleRouter = require('./article');
const roleRouter = require('./role');
const permissionRouter = require('./permission');

module.exports = {
    homeRouter,
    userRouter,
    articleRouter,
    roleRouter,
    permissionRouter
};