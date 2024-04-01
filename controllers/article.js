const db = require('../config/dbContent');
const sequelize = require('sequelize')
const ArticleModel = require('../models/article');
const UserModel = require('../models/user');
const AdminModel = require('../models/admin');
const TagArticleModel = require('../models/tag_article');
const TagModel = require('../models/tag');
const ThumbModel = require('../models/thumb');
const { Op, fn, col } = require('sequelize');
const { checkToken } = require('../utils/token');
const redisClient = require('../config/redis');

// thorough表查询
// 关联多个表，可能会出现第二次调用失败，关联的定义放在模型的定义之外，通常是在文件顶部，以确保关联只被定义一次
ArticleModel.belongsToMany(TagModel, { through: 'tag_article', foreignKey: 'aid', otherKey: 'tid' });
// 一对多关联
ArticleModel.belongsTo(AdminModel, { as: 'admin', foreignKey: 'admin_id', targetKey: 'id' });
ArticleModel.belongsTo(UserModel, { as: 'user', foreignKey: 'user_id', targetKey: 'id' });
ArticleModel.belongsTo(ThumbModel, { foreignKey: 'id', targetKey: 'aid' });

// redis实例
const redis = redisClient();

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

    // 构建 redis 缓存键名
    const redisKey = `articleList_${pageNo}_${pageSize}_${JSON.stringify(where)}`;

    try {
        // 从redis获取数据
        const redisData = await redis.get(redisKey);
        if (redisData) {
            ctx.success({ msg: "查询成功", data: JSON.parse(redisData) });
            return;
        }
        // 缓存不存在，则查询数据库
        const res = await ArticleModel.findAndCountAll({
            attributes: {
                include: [
                    [
                        sequelize.literal('CASE WHEN user_id > 0 THEN "用户" ELSE "管理员" END'),
                        'type'
                    ],
                    // 获取点赞数
                    [
                        sequelize.literal(`(SELECT COUNT(*) FROM thumb WHERE aid = article.id) + thumbs_num`), 
                        'real_thumbs_num'
                    ],
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
                    model: ThumbModel,
                    attributes: [],
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
        // 将缓存数据存储到redis
        await redis.setex(redisKey, 3600, JSON.stringify(res));
        ctx.success({ msg: "查询成功", data: res });
    } catch (err) {
        console.log(err);
        ctx.fail({ code: 500, msg: '查询失败' });
    }
    
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
    try {
        const post = ctx.request.body;
        const pageNo = post.pageNo || 1;
        const pageSize = post.pageSize || 10;

        // 获取用户id
        let uid = 0;
        if (ctx.header.authorization) {
            const token = ctx.header.authorization.split(' ')[1];
            const decoded = await checkToken(token);
            uid = decoded.userinfo.id;
        }

        // redis 键名
        const redisKey = `newsList_${pageNo}_${pageSize}_${JSON.stringify(post)}`;

        // 先从 Redis 获取数据
        const redisData = await redis.get(redisKey);
        if (redisData) {
            ctx.success({ msg: '获取成功', data: JSON.parse(redisData) });
            return;
        }

        const where = {
            status: 1
        };
        if (post.title) {
            where.title = { [Op.like]: `%${post.title}%` };
        }

        const res = await ArticleModel.findAndCountAll({
            offset: (pageNo - 1) * pageSize,
            limit: pageSize,
            where,
            attributes: { 
                // exclude: ['admin_id'],
                include: [
                    [sequelize.literal('CASE WHEN user_id > 0 THEN "用户" ELSE "管理员" END'), 'type'],
                    [sequelize.literal(`(SELECT COUNT(*) FROM thumb WHERE aid = article.id) + thumbs_num`), 'computed_thumbs_num'],
                    [sequelize.literal(`(SELECT COUNT(*) FROM thumb WHERE uid = ${uid} AND aid = article.id)`), 'is_thumb'],
                ]
            },
            include: [
                {
                    model: ThumbModel,
                    attributes: [],                    
                },
                {
                    model: TagModel,
                    through: { attributes: [] },
                    where: post.tag_name ? { name: { [Op.like]: `%${post.tag_name}%` } } : {}
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
                    required: false
                },
            ],
            order: [['create_time', 'DESC']],
            distinct: true,
        });

        // 处理作者信息
        res.rows.forEach(item => {
            item.dataValues.author = item.dataValues.user_id > 0 ? item.dataValues.user?.username : item.dataValues.admin?.username;
        });

        // 将查询结果存入 Redis 缓存
        await redis.setex(redisKey, 3600, JSON.stringify(res));

        ctx.success({ msg: "查询成功", data: res });
    } catch (e) {
        ctx.fail({ msg: "查询失败", data: e });
    }
}

// 前台获取文章详情
const newDetail = async (ctx) => {
    const post = ctx.request.body;

    // 获取用户id
    let uid = 0;
    if (ctx.header.authorization) {
        const token = ctx.header.authorization.split(' ')[1];
        const decoded = await checkToken(token);
        uid = decoded.userinfo.id;
    }

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
                model: ThumbModel,
                attributes: [],
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
                ],
                // 判断当前用户是否点赞
                [
                    sequelize.literal(`(SELECT COUNT(*) FROM thumb WHERE uid = ${uid} AND aid = article.id)`), 
                    'is_thumb'
                ],
                // 获取点赞数
                [
                    sequelize.literal(`(SELECT COUNT(*) FROM thumb WHERE aid = article.id) + thumbs_num`), 
                    'thumbs_num'
                ],
            ]
        },
    });
    ctx.success({ msg: "查询成功", data: res });
}

// 前台用户创建文章
const createArticle = async (ctx) => {
    // 拿取token的内容
    if (!ctx.header.authorization) {
        ctx.fail({ code: 1001, msg: 'token不存在' });
        return
    }

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
        cover: post.cover,
        title: post.title,
        content: post.content,
        admin_id: 0,
        status: 1,
        user_id: decoded.userinfo.id,
        create_time: new Date(),
        update_time: new Date(),
    });
    if(res) {
        // 获取文章的标签
        const tag = post.tags ? post.tags : [];
        if (tag.length > 0) {
            tag.forEach(async item => {
                await TagArticleModel.create({
                    aid: res.dataValues.id,
                    tid: item
                });
            });
        }
        ctx.success({ msg: '发布成功' });
        
    } else {
        ctx.fail({ code: 1001, msg: '发布失败' });
    }
}

// 给文章点赞
const thumbArticle = async (ctx) => {
    const post = ctx.request.body;
    if(!post.aid) {
        ctx.fail({ code: 1001, msg: '文章id不能为空' });
        return;
    }
    // 获取用户id
    const token = ctx.request.header.authorization;
    let payload
    if (token) {
        payload = await checkToken(token.split(' ')[1]);  // 解密，获取payload
    }
    let uid = payload ? payload.userinfo.id : 0;

    if (!uid) {
        ctx.fail({ code: 401, msg: "未登录" });
        return;
    }
    // 点赞过了则取消点赞，否则点赞
    const res = await ThumbModel.findOne({
        where: {
            uid: uid,
            aid: post.aid
        }
    });
    if(res) {
        await ThumbModel.destroy({
            where: {
                uid: uid,
                aid: post.aid
            }
        });
        ctx.success({ msg: '取消点赞' });
    } else {
        await ThumbModel.create({
            uid: uid,
            aid: post.aid,
            cid: 0,
            create_time: new Date(),
        });
        ctx.success({ msg: '点赞成功' });
    }
}

module.exports = {
    addArticle,
    articleList,
    articleListByUserId,
    updateArticle,
    deleteArticle,
    newList,
    newDetail,
    createArticle,
    thumbArticle,
}
