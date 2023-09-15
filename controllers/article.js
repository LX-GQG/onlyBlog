const db = require('../config/dbContent');
const sequelize = require('sequelize')
const ArticleModel = require('../models/article');
const UserModel = require('../models/user');
const AdminModel = require('../models/admin');
const TagArticleModel = require('../models/tag_article');
const TagModel = require('../models/tag');
const { Op, fn, col } = require('sequelize');
const { checkToken } = require('../utils/token');

// thorough表查询
// 关联多个表，可能会出现第二次调用失败，关联的定义放在模型的定义之外，通常是在文件顶部，以确保关联只被定义一次
ArticleModel.belongsToMany(TagModel, { through: 'tag_article', foreignKey: 'aid', otherKey: 'tid' });
// 一对多关联
ArticleModel.belongsTo(AdminModel, { as: 'admin', foreignKey: 'admin_id', targetKey: 'id' });
ArticleModel.belongsTo(UserModel, { as: 'user', foreignKey: 'user_id', targetKey: 'id' });

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
            cover: post.cover,
            title: post.title,
            content: post.content,
            admin_id: decoded.userinfo.id,
            status: post.status,
            user_id: post.user_id || 0,
            create_time: new Date(),
            update_time: new Date(),
        });
        if(res) {
            // 获取文章的标签
            const tag = post.tags;
            if (tag.length > 0) {
                tag.forEach(async item => {
                    await TagArticleModel.create({
                        aid: res.dataValues.id,
                        tid: item.id
                    });
                });
            }
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
        attributes: {
            include: [
                [
                    sequelize.literal('CASE WHEN user_id > 0 THEN "用户" ELSE "管理员" END'),
                    'type'
                ]
            ]
        },
        include: [
            {
                model: TagModel,
                through: {
                    attributes: []
                },
            },
            {
                model: AdminModel,
                as: 'admin',
                attributes: ['username'],
                required: false,
            },
            {
                model: UserModel,
                as: 'user',
                attributes: ['username'],
                required: false,
            },
        ],
        where: where,
        offset: (pageNo - 1) * pageSize,
        limit: pageSize,
        order: [['create_time', 'DESC']],
        // 添加 distinct 选项,防止重复数据
        distinct: true,
    });
    // 处理user_id>0,因为user和admin可能为空
    res.rows.forEach(item => {
        if (item.dataValues.user_id > 0 && item.dataValues.user) {
            let author = item.dataValues.user.dataValues.username
            item.dataValues.author = author        
        } else if (item.dataValues.user_id == 0 && item.dataValues.admin){
            let author = item.dataValues.admin.dataValues.username
            item.dataValues.author = author 
        }
    });
    // 根据文章author字段进行模糊查询
    if (post.author) {
        const author = post.author;
        const res2 = res.rows.filter(item => {
            return item.dataValues.author.indexOf(author) > -1;
        });
        res.rows = res2;
    }
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
    // 获取文章的标签
    const tag = post.tags;
    // 根据文章id删除tag_article表中的数据
    await TagArticleModel.destroy({
        where: {
            aid: post.id
        }
    });
    // 添加新的标签
    if(tag.length > 0) {
        tag.forEach(async item => {
            const res = await TagArticleModel.create({
                aid: post.id,
                tid: item.id
            });
        });
    }
    // thorough表查询
    const res = await ArticleModel.update({
        cover: post.cover,
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
    
    let where = {};
    let relation_where = {};

    if (post.tag_name) {
        relation_where.name = {
            [Op.like]: `%${post.tag_name}%`
        }
    }

    where.status = 1
    if (post.title) {
        where.title = {
            [Op.like]: `%${post.title}%`
        }
    }
    const res = await ArticleModel.findAndCountAll({
        offset: (pageNo - 1) * pageSize,
        limit: pageSize,
        where,
        attributes: { 
            // exclude: ['admin_id'],
            include: [
                [
                    sequelize.literal('CASE WHEN user_id > 0 THEN "用户" ELSE "管理员" END'),
                    'type'
                ],

            ]
        },
        include: [
            {
                model: TagModel,
                // 模糊查询
                relation_where,
                through: {
                    attributes: []
                }
            },
            {
                model: AdminModel,
                as: 'admin',
                attributes: ['username'],
                required: false
            },
            {
                model: UserModel,
                as: 'user',
                attributes: ['username'],
                required: false // 允许 user 为空
            },
        ],
        order: [['create_time', 'DESC']],
        // 添加 distinct 选项,防止重复数据
        distinct: true,
    })
    // 处理user_id>0,因为user和admin可能为空
    res.rows.forEach(item => {
        if (item.dataValues.user_id > 0 && item.dataValues.user) {
            item.dataValues.author = item.dataValues.user.dataValues.username
        } else if (item.dataValues.user_id == 0 && item.dataValues.admin) {
            item.dataValues.author = item.dataValues.admin.dataValues.username
        }
    });
    ctx.success({ msg: "查询成功", data: res });
}

// 前台获取文章详情
const newDetail = async (ctx) => {
    const post = ctx.request.body;
    if(!post.id) {
        ctx.fail({ code: 1001, msg: '参数不能为空' });
        return;
    }
    const res = await ArticleModel.findOne({
        where: {
            id: post.id
        },
        include: [
            {
                model: TagModel,
                through: {
                    attributes: []
                }
            },
            {
                model: AdminModel,
                as: 'admin',
                attributes: ['username']
            },
            {
                model: UserModel,
                as: 'user',
                attributes: ['username'],
            },
        ],
        attributes: {
            include: [
                [
                    sequelize.literal('CASE WHEN user_id > 0 THEN "用户" ELSE "管理员" END'),
                    'type'
                ],
                [
                    sequelize.literal('CASE WHEN user_id > 0 THEN user.username ELSE admin.username END'),
                    'author'
                ]
            ]
        },
    });
    ctx.success({ msg: "查询成功", data: res });
}

module.exports = {
    addArticle,
    articleList,
    articleListByUserId,
    updateArticle,
    deleteArticle,
    newList,
    newDetail
}
