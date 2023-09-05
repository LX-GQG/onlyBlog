const db = require('../config/dbContent');
const sequelize = require('sequelize')
const ArticleModel = require('../models/article');
const UserModel = require('../models/user');
const AdminModel = require('../models/admin');
const { Op } = require('sequelize');
const { checkToken } = require('../utils/token');

// thorough表查询
// 关联多个表，可能会出现第二次调用失败，关联的定义放在模型的定义之外，通常是在文件顶部，以确保关联只被定义一次
ArticleModel.belongsTo(AdminModel, { foreignKey: 'admin_id', targetKey: 'id', as: 'admin' });
ArticleModel.belongsTo(UserModel, { foreignKey: 'user_id', targetKey: 'id', as: 'user' });

// 后台添加文章
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
        if(post.status) {
            post.status = 1;
        }
        const res = await ArticleModel.create({
            title: post.title,
            content: post.content,
            admin_id: decoded.userinfo.id,
            status: post.status || 1,
            user_id: post.user_id || 0,
            type: '管理员',
            username: decoded.userinfo.username,
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
        // 通过admin表的username字段和user表的username字段进行模糊查询
        where.username = {
            [Op.like]: `%${post.username}%`
        };
        
    }
    if (post.startDate && post.endDate) {
        where.create_time = {
            [Op.between]: [post.startDate, post.endDate]
        };
    }
    if (post.user_id) {
        where.user_id = post.user_id;
    }
    if (post.admin_id) {
        where.admin_id = post.admin_id;
    }
    const res = await ArticleModel.findAndCountAll({
        enableQueryCache: false,
        where: where,
        offset: (pageNo - 1) * pageSize,
        limit: pageSize,
        order: [['create_time', 'DESC']],
        include: [
            {
                model: AdminModel,
                as: 'admin',
                attributes: ['username']
            },
            {
                model: UserModel,
                as: 'user',
                attributes: ['username']
            }
        ],
        attributes: {
            include: [
                [
                    sequelize.literal('CASE WHEN user_id > 0 THEN "用户" ELSE "管理员" END'),
                    'type'
                ],
                [
                    sequelize.literal('CASE WHEN user_id > 0 THEN user.username ELSE admin.username END'),
                    'username'
                ]
            ]
        }
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
        status: post.status,
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
    if(post.id) {
        const res = await ArticleModel.destroy({
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

// 前台获取文章列表
const newList = async (ctx) => {
    const post = ctx.request.body;
    const pageNo = post.pageNo || 1;
    const pageSize = post.pageSize || 10;
    const res = await ArticleModel.findAndCountAll({
        offset: (pageNo - 1) * pageSize,
        limit: pageSize,
        where: {
            status: 1
        },
        attributes: { exclude: ['admin_id','user_id'] },
    })

    ctx.success({ msg: "查询成功", data: res });

}
module.exports = {
    addArticle,
    articleList,
    articleListByUserId,
    updateArticle,
    deleteArticle,
    newList
}
