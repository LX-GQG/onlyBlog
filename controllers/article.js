const db = require('../config/dbContent');
const ArticleModel = require('../models/article');
const UserModel = require('../models/user');
const { Op } = require('sequelize');
const { checkToken } = require('../utils/token');

const addArticle = async (ctx) => {
    // 拿取token的内容
    const token = ctx.header.authorization.split(' ')[1];
        const decoded = await checkToken(token);
        // 发布文章
        const post = ctx.request.body;
        // 所有参数不能为空
        if(!post.title || !post.content) {
            ctx.fail({ code: 1001, msg: '参数不能为空' });
            return; 
        }
        const res = await ArticleModel.create({
            title: post.title,
            content: post.content,
            user_id: decoded.userinfo.id,
            create_time: new Date(),
            update_time: new Date(),
        });
        if(res) {
            ctx.success({ msg: '发布成功' });
        } else {
            ctx.fail({ code: 1001, msg: '发布失败' });
        }
}

// 文章列表
const articleList = async (ctx) => {
    // thorough表查询
    ArticleModel.belongsTo(UserModel, { foreignKey: 'user_id', targetKey: 'id' });
    // 查询分页，默认按时间倒序
    // 对title，username模糊查询
    const post = ctx.request.body;
    const pageNo = post.pageNo || 1;
    const pageSize = post.pageSize || 10;
    const where = {};
    if (post.title) {
        where.title = {
            [Op.like]: `%${post.title}%`
        };
    }
    if (post.username) {
        where['$user.username$'] = {
            [Op.like]: `%${post.username}%`
        };
    }
    if (post.startDate && post.endDate) {
        where.create_time = {
            [Op.between]: [post.startDate, post.endDate]
        };
    }
    const res = await ArticleModel.findAndCountAll({
        include: [{
            model: UserModel,
            attributes: ['username']
        }],
        offset: (pageNo - 1) * pageSize,
        limit: pageSize,
        where,
        order: [
            ['create_time', 'DESC']
        ]
    });
    ctx.success({ msg: "查询成功", data: res });
}

// 获取指定用户的文章列表
const articleListByUserId = async (ctx) => {
    const post = ctx.request.body;
    if(!post.user_id) {
        ctx.fail({ code: 1001, msg: '参数不能为空' });
        return;
    }
    const res = await ArticleModel.findAll({
        where: {
            user_id: post.user_id
        }
    });
    ctx.success({ msg: "查询成功", data: res });
}

// 修改文章
const updateArticle = async (ctx) => {
    const post = ctx.request.body;
    // 所有参数不能为空
    if(!post.title && !post.content && !post.id) {
        ctx.fail({ code: 1001, msg: '参数不能为空' });
        return;
    }
    // thorough表查询
    const res = await ArticleModel.update({
        title: post.title,
        content: post.content,
        update_time: new Date(),
    }, {
        where: {
            id: post.id
        }
    });
    if(res) {
        ctx.success({ msg: '修改成功' });
    } else {
        ctx.fail({ code: 1001, msg: '修改失败' });
    }
}

// 删除文章
const deleteArticle = async (ctx) => {
    const post = ctx.request.body;
    // 所有参数不能为空
    if(!post.id) {
        const res = await ArticleModel.delete({
            where: {
                id: post.id
            }
        });
        if(res) {
            ctx.success({ msg: '删除成功' });
        } else {
            ctx.fail({ code: 1001, msg: '删除失败' });
        }
    } else {
        ctx.fail({ code: 1001, msg: '参数不能为空' });
    }
}

module.exports = {
    addArticle,
    articleList,
    articleListByUserId,
    updateArticle,
    deleteArticle,
}
