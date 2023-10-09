const db = require('../config/dbContent');
const sequelize = require('sequelize')
const CommentModel = require('../models/comment');
const ArticleModel = require('../models/article');
const ThumbModel = require('../models/thumb');
const UserModel = require('../models/user');
const { Op, fn, col } = require('sequelize');
const { checkToken } = require('../utils/token');

CommentModel.belongsTo(ArticleModel, { foreignKey: 'aid', targetKey: 'id' });
CommentModel.belongsTo(UserModel, { foreignKey: 'uid', targetKey: 'id' });
CommentModel.belongsTo(ThumbModel, { foreignKey: 'id', targetKey: 'cid' });

// 获取文章评论
const articleComment = async (ctx) => {
    const post = ctx.request.body;
    const pageNo = post.pageNo || 1;
    const pageSize = post.pageSize || 10;
    
    if (!post.aid) {
        ctx.fail({ msg: "文章id不能为空" });
        return;
    }
    const res = await CommentModel.findAll({
        where: {
            aid: post.aid,
        },
        include: [{
            model: UserModel,
            attributes: ['id', 'username', 'avatar'],
        }, {
            model: ThumbModel,
            attributes: [],
        }],
        attributes: {
            include: [
                // 获取点赞数，并累加thumbs_num原本的值
                [sequelize.literal(`(SELECT COUNT(*) FROM thumb WHERE cid = comment.id)`), 'real_thumbs_num'],
            ],
        },
        order: [
            ['create_time', 'DESC'],
        ],
        group: ['comment.id'], // 根据评论ID分组
        distinct: true,
    });
    ctx.success({ msg: "查询成功", data: res });

}

// 评论
const addComment = async (ctx) => {
    const post = ctx.request.body;

    if (!post.aid) {
        ctx.fail({ msg: "文章id不能为空" });
        return;
    }
    if (!post.content) {
        ctx.fail({ msg: "评论内容不能为空" });
        return;
    }
    if (!post.uid) {
        ctx.fail({ msg: "用户id不能为空" });
        return;
    }
    const res = await CommentModel.create({
        aid: post.aid,
        uid: post.uid,
        pid: post.pid || 0,
        content: post.content,
        create_time: new Date(),
    });
    if (res) {
        ctx.success({ msg: "评论成功", data: res });
    } else {
        ctx.fail({ msg: "评论失败", data: res });
    }
}

// 修改评论点赞数
const updateComment = async (ctx) => {
    const post = ctx.request.body;

    if (!post.id) {
        ctx.fail({ msg: "评论id不能为空" });
        return;
    }

    if (!post.thumbs_num) {
        ctx.fail({ msg: "点赞数不能为空" });
        return;
    }

    const res = await CommentModel.update({
        thumbs_num: post.thumbs_num,
    }, {
        where: {
            id: post.id,
        }
    });
    
    if (res) {
        ctx.success({ msg: "修改成功", data: res });
    } else {
        ctx.fail({ msg: "修改失败", data: res });
    }
}


// 点赞
const thumbsUp = async (ctx) => {
    const post = ctx.request.body;

    if (!post.id) {
        ctx.fail({ msg: "评论id不能为空" });
        return;
    }

    // 判断是否已经点赞
    const isThumb = await ThumbModel.findOne({
        where: {
            cid: post.id,
            uid: post.uid,
        }
    });
    const res = null;
    if (isThumb) {
        // 已经点赞，取消点赞
        res = await ThumbModel.destroy({
            where: {
                cid: post.id,
                uid: post.uid,
            }
        });
        return;
    } else {
        // 没有点赞，点赞
        res = await ThumbModel.create({
            cid: post.id,
            uid: post.uid,
            aid: 0,
            create_time: new Date(),
        });
    }
    if (res) {
        ctx.success({ msg: "点赞成功", data: res });
    } else {
        ctx.fail({ msg: "点赞失败", data: res });
    }
    
}

// 删除评论
const delComment = async (ctx) => {
    const post = ctx.request.body;

    if (!post.id) {
        ctx.fail({ msg: "评论id不能为空" });
        return;
    }

    const res = await CommentModel.destroy({
        where: {
            id: post.id,
        }
    });
    ctx.success({ msg: "删除成功", data: res });
}

// 前台获取评论
const newComment = async (ctx) => {
    const post = ctx.request.body;
    const pageNo = post.pageNo || 1;
    const pageSize = post.pageSize || 10;

    // 获取用户id
    const token = ctx.request.header.authorization;
    let payload
    if (token) {
        payload = await checkToken(token.split(' ')[1]);  // 解密，获取payload
    }
    const uid = payload ? payload.userinfo.id : 0;

    if (!post.aid) {
        ctx.fail({ msg: "文章id不能为空" });
        return;
    }
        
    // 获取评论，并且获取点赞数
    const res = await CommentModel.findAll({
        where: {
            aid: post.aid,
        },
        include: [{
            model: UserModel,
            attributes: ['id', 'username', 'avatar'],
        }, {
            model: ThumbModel,
            attributes: [],
        }
        ],
        attributes: {
            include: [
                // 判断当前用户是否点赞
                [sequelize.literal(`(SELECT COUNT(*) FROM thumb WHERE uid = ${uid} AND cid = comment.id)`), 'is_thumb'],
                // 获取点赞数
                [sequelize.literal(`(SELECT COUNT(*) FROM thumb WHERE cid = comment.id) + thumbs_num`), 'thumbs_num'],
            ],
        },
        order: [
            ['create_time', 'DESC'],
        ],
        group: ['comment.id'], // 根据评论ID分组
        offset: (pageNo - 1) * pageSize,
        limit: pageSize,
        distinct: true,
        replacements: { uid: uid },
    });
    
    ctx.success({ msg: "查询成功", data: res });
}

module.exports = {
    articleComment,
    addComment,
    delComment,
    newComment,
    updateComment,
    thumbsUp,
}