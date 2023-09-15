const db = require('../config/dbContent');
const UserModel = require('../models/user');
const { getClientIP } = require('../utils/ip');
const { createToken } = require('../utils/token');
const { Op } = require('sequelize');
const { hashPasswordAsync,verifyPasswordAsync } = require('../utils/utils');


const userList = async (ctx) => {
    const post = ctx.request.body;
    const pageNo = post.pageNo || 1;
    const pageSize = post.pageSize || 10;
    const where = {};
    if (post.id) {
        where.id = {
            [Op.like]: `%${post.id}%`
        };
    }
    if (post.username) {
        where.username = {
            [Op.like]: `%${post.username}%`
        };
    }
    if (post.startDate && post.endDate) {
        where.create_time = {
            [Op.between]: [post.startDate, post.endDate]
        };
    }
    if (post.email) {
        where.email = {
            [Op.like]: `%${post.email}%`
        }
    }
    const res = await UserModel.findAndCountAll({
        attributes: { exclude: ['password'] }, // 排除密码字段
        offset: (pageNo - 1) * pageSize,
        limit: pageSize,
        where: where
    });
    ctx.success({ data: res });
};

const addUser = async (ctx) => {
    const post = ctx.request.body;
    if(!post.username || !post.password) {
        ctx.fail({ code: 1001, msg: '用户名或密码不能为空' });
        return;
    }
    // 用户名不能相同
    const res = await UserModel.findOne({
        where: {
            username: post.username
        }
    });
    if(res) {
        ctx.fail({ code: 1001, msg: '用户名已存在' });
        return;
    }
    // 密码加密
    post.password = await hashPasswordAsync(post.password);
    post.create_time = new Date();
    post.update_time = new Date();
    const ip = getClientIP(ctx);
    post.ip = ip;
    // 获取用户的真实ip
    let result;
    try {
        result = await UserModel.create(post);
    } catch (error) {
        ctx.fail({ code: 1001, msg: '注册失败' });
        return;
    }
    ctx.success('注册成功', result);
}

const updateUser = async (ctx) => {
    const post = ctx.request.body;
    if(!post.id || !post.username) {
        ctx.fail({ code: 1001, msg: 'id或者用户名不能为空' });
        return;
    }
    // 用户名不能相同
    const isUsername = await UserModel.findOne({
        where: {
            username: post.username,
            id: {
                [Op.ne]: post.id
            }
        }
    });
    if(isUsername) {
        ctx.fail({ code: 1001, msg: '用户名已存在' });
        return;
    }
    // 如果密码为空，则不修改密码
    if(!post.password) {
        delete post.password;
    }
    // 对密码进行加密
    if(post.password) {
        post.password = await hashPasswordAsync(post.password);
    }
    const res = await UserModel.update(post, {
        where: {
            id: post.id
        }
    });
    
    ctx.success('修改成功', res);
}

// 修改密码
const updatePassword = async (ctx) => {
    const post = ctx.request.body;
    if(!post.id) {
        ctx.fail({ code: 1001, msg: 'id不能为空' });
        return;
    }
    if(!post.password) {
        ctx.fail({ code: 1001, msg: '密码不能为空' });
        return;
    }
    // 需知道原密码
    if(!post.old_password) {
        ctx.fail({ code: 1001, msg: '原密码不能为空' });
        return;
    }
    const res = await UserModel.findOne({
        where: {
            id: post.id
        }
    });
    // 验证密码
    const isPassword = await verifyPasswordAsync(post.old_password, res.dataValues.password);
    if(!isPassword) {
        ctx.fail({ code: 1001, msg: '原密码错误' });
        return;
    }
    // 对密码进行加密
    post.password = await hashPasswordAsync(post.password);
    const result = await UserModel.update(post, {
        where: {
            id: post.id
        }
    });
    ctx.success('修改成功', result);
}

const deleteUser = async (ctx) => {
    const post = ctx.request.body;
    if(!post.id) {
        ctx.fail({ code: 1001, msg: 'id不能为空' });
        return;
    }
    const res = await UserModel.destroy({
        where: {
            id: post.id
        }
    });
    // 判断是否删除成功
    if(!res) {
        ctx.fail({ code: 1001, msg: '删除失败' });
        return;
    }
    ctx.success('删除成功', res);
}

const login = async (ctx) => {
    const post = ctx.request.body;
    if(!post.username || !post.password) {
        ctx.fail({ code: 1001, msg: '用户名或密码不能为空' });
        return;
    }
    // 用户名不能相同并且status为1
    const res = await UserModel.findOne({
        where: {
            username: post.username,
            status: 1
        }
    });
    if(!res) {
        ctx.fail({ code: 1001, msg: '没有此用户或者用户被禁用' });
        return;
    }
    // 验证密码
    const isPassword = await verifyPasswordAsync(post.password, res.dataValues.password);
    if(!isPassword) {
        ctx.fail({ code: 1001, msg: '密码错误' });
        return;
    }
    // 修改ip
    const ip = getClientIP(ctx);
    await UserModel.update({
        ip: ip
    }, {
        where: {
            username: post.username
        }
    });
    if(res) {
        // 生成token,并返回用户信息
        const userinfo = res.dataValues;
        userinfo.password = '';
        const token = createToken({ userinfo: userinfo });
        ctx.body = {
            code: 200,
            msg: '登录成功',
            data: {
                userinfo,
                token
            }
        }
    }
}

// 注册
const register = async (ctx) => {
    const post = ctx.request.body;
    if(!post.username || !post.password) {
        ctx.fail({ code: 1001, msg: '用户名或密码不能为空' });
        return;
    }
    // 用户名不能相同
    const res = await UserModel.findOne({
        where: {
            username: post.username
        }
    });
    if(res) {
        ctx.fail({ code: 1001, msg: '用户名已存在' });
        return;
    }
    // 密码加密
    post.password = await hashPasswordAsync(post.password);
    post.create_time = new Date();
    post.update_time = new Date();

    // 获取用户的真实ip
    const ip = getClientIP(ctx);
    post.ip = ip;
    
    let result;
    try {
        result = await UserModel.create(post);
    } catch (error) {
        ctx.fail({ code: 1001, msg: '注册失败' });
        return;
    }
    ctx.success('注册成功', result);
}
  
module.exports = { userList,addUser,login,updateUser,deleteUser,updatePassword,register };