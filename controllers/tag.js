const db = require('../config/dbContent');
const TagModel = require('../models/tag');
const { getClientIP } = require('../utils/ip');
const { createToken } = require('../utils/token');
const { Op } = require('sequelize');

// 标签列表
const tagList = async (ctx) => {
    const post = ctx.request.body;
    const pageNo = post.pageNo || 1;
    const pageSize = post.pageSize || 10;
    const where = {};
    if (post.id) {
        where.id = {
            [Op.like]: `%${post.id}%`
        };
    }
    if (post.name) {
        where.name = {
            [Op.like]: `%${post.name}%`
        };
    }
    const res = await TagModel.findAndCountAll({
        offset: (pageNo - 1) * pageSize,
        limit: pageSize,
        where: where
    });
    ctx.success({ data: res });
};

const addTag = async (ctx) => {
    const post = ctx.request.body;
    if(!post.name) {
        ctx.fail({ code: 1001, msg: '标签名不能为空' });
        return;
    }
    const res = await TagModel.findOne({
        where: {
            name: post.name
        }
    });
    if(res) {
        ctx.fail({ code: 1001, msg: '标签名已存在' });
        return;
    }
    const result = await TagModel.create({
        name: post.name,
    });
    if(result) {
        ctx.success({ msg: '添加成功' });
    } else {
        ctx.fail({ code: 1001, msg: '添加失败' });
    }
}

const updateTag = async (ctx) => {
    const post = ctx.request.body;
    if(!post.id || !post.name) {
        ctx.fail({ code: 1001, msg: '参数不能为空' });
        return;
    }
    const res = await TagModel.findOne({
        where: {
            name: post.name
        }
    });
    if(res) {
        ctx.fail({ code: 1001, msg: '标签名已存在' });
        return;
    }
    const result = await TagModel.update({
        name: post.name,
    }, {
        where: {
            id: post.id
        }
    });
    if(result) {
        ctx.success({ msg: '修改成功' });
    } else {
        ctx.fail({ code: 1001, msg: '修改失败' });
    }
}

const deleteTag = async (ctx) => {
    const post = ctx.request.body;
    if(!post.id) {
        ctx.fail({ code: 1001, msg: 'id不能为空' });
        return;
    }   
    const res = await TagModel.destroy({
        where: {
            id: post.id
        }
    });
    if(res) {
        ctx.success({ msg: '删除成功' });
    } else {
        ctx.fail({ code: 1001, msg: '删除失败' });
    }
}

// 获取文章标签
const getArticleTag = async (ctx) => {
    const res = await TagModel.findAll();
    ctx.success({ data: res });
}

module.exports = {
    tagList,
    addTag,
    updateTag,
    deleteTag,
    getArticleTag
}