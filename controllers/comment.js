const db = require('../config/dbContent');
const sequelize = require('sequelize')
const CommentModel = require('../models/comment');
const ArticleModel = require('../models/article');
const UserModel = require('../models/user');
const { Op, fn, col } = require('sequelize');
const { checkToken } = require('../utils/token');

CommentModel.belongsTo(ArticleModel, { foreignKey: 'aid', targetKey: 'id' });
CommentModel.belongsTo(UserModel, { foreignKey: 'uid', targetKey: 'id' });

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
        }],
        order: [
            ['create_time', 'DESC'],
        ],
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
    console.log(post.pid || 0);
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
        }],
        order: [
            ['create_time', 'DESC'],
        ],
    });
    ctx.success({ msg: "查询成功", data: res });
}

module.exports = {
    articleComment,
    addComment,
    delComment,
    newComment,
}