const db = require('../config/dbContent');
const AdminModel = require('../models/admin');
const RoleModel = require('../models/role');
const AdminRoleModel = require('../models/admin_role');
const { createToken } = require('../utils/token');
const { getClientIP } = require('../utils/ip');
const { Op } = require('sequelize');
const { hashPasswordAsync,verifyPasswordAsync } = require('../utils/utils');

const admin = async (ctx) => {
    try {
        // const token = ctx.header.authorization.split(' ')[1];
        // const decoded = await checkToken(token);
        const sql = 'select * from admin';
        const data = await db.query(sql);
        ctx.body = data;
    } catch (err) {
        ctx.fail({ code: 401, msg: 'token错误' });
    }
}

const adminList = async (ctx) => {
    AdminModel.belongsToMany(RoleModel, { through: 'admin_role', foreignKey: 'uid', otherKey: 'rid' }); 
    // 基于through表查询，分页查询
    const post = ctx.request.body;
    const pageNo = post.pageNo || 1;
    const pageSize = post.pageSize || 10;
    const res = await AdminModel.findAndCountAll({
        attributes: { exclude: ['password'] }, // 排除密码字段
        include: [{
            model: RoleModel,
            attributes: ['role_type']
        }],
        // 排除超级管理员
        where: {
            rid: {
                [Op.ne]: 0
            }
        },
        offset: (pageNo - 1) * pageSize,
        limit: pageSize,
    });
    
    ctx.success({ data: res });
};

const addAdmin = async (ctx) => {
    const post = ctx.request.body;
    if(!post.username || !post.password) {
        ctx.fail({ code: 1001, msg: '用户名或密码不能为空' });
        return;
    }
    if(!post.rid) {
        ctx.fail({ code: 1001, msg: '角色不能为空' });
        return;
    }
    // 用户名不能相同
    const res = await AdminModel.findOne({
        where: {
            username: post.username
        }
    });
    if(res) {
        ctx.fail({ code: 1001, msg: '用户名已存在' });
        return;
    }
    if(!post.username || !post.password) {
        ctx.fail({ code: 1001, msg: '用户名或密码不能为空' });
        return;
    }
    if(!post.rid) {
        ctx.fail({ code: 1001, msg: '角色不能为空' });
        return;
    }
    // 密码加密
    post.password = await hashPasswordAsync(post.password);
    const ip = getClientIP(ctx);
    post.ip = ip;
    let result;
    try {
        result = await AdminModel.create(post);
        await AdminRoleModel.create({
            rid: post.rid,
            uid: result.dataValues.id
        });

    } catch (error) {
        ctx.fail({ code: 1001, msg: '注册失败' });
        return;
    }
    ctx.success('注册成功', result);
}

const login = async (ctx) => {
    const post = ctx.request.body;
    if(!post.username || !post.password) {
        ctx.fail({ code: 1001, msg: '用户名或密码不能为空' });
        return;
    }
    const res = await AdminModel.findOne({
        where: {
            username: post.username
        }
    });
    // 验证密码
    const isPassword = await verifyPasswordAsync(post.password, res.dataValues.password);
    if(!isPassword) {
        ctx.fail({ code: 1001, msg: '密码错误' });
        return;
    }
    // 判断是否被禁用
    if(res.dataValues.status === 0) {
        ctx.fail({ code: 1001, msg: '该用户已被禁用' });
        return;
    }
    // 修改ip
    const ip = getClientIP(ctx);
    await AdminModel.update({
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
    } else {
        ctx.fail({ code: 1001, msg: '没有此用户' });
        return;
    }
}

const updateAdmin = async (ctx) => {
    const post = ctx.request.body;
    if(!post.id) {
        ctx.fail({ code: 1001, msg: 'id不能为空' });
        return;
    }
    // 用户名不能相同
    const isUsername = await AdminModel.findOne({
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
    // 角色不能为空, 超级管理员则跳过
    if(post.rid !== 0) {
        if(!post.rid) {
            ctx.fail({ code: 1001, msg: '角色不能为空' });
            return;
        }
    }
    // 如果密码为空，则不修改密码
    if(!post.password) {
        delete post.password;
    }
    // 对密码进行加密
    if(post.password) {
        post.password = await hashPasswordAsync(post.password);
    }
    AdminModel.belongsToMany(RoleModel, { through: 'admin_role', foreignKey: 'uid', otherKey: 'rid' }); 
    const res = await AdminModel.update(post, {
        where: {
            id: post.id
        }
    });
    
    await AdminRoleModel.update({
        rid: post.rid
    }, {
        where: {
            uid: post.id
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
    const res = await AdminModel.findOne({
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
    const result = await AdminModel.update(post, {
        where: {
            id: post.id
        }
    });
    ctx.success('修改成功', result);
}

const deleteAdmin = async (ctx) => {
    const post = ctx.request.body;
    if(!post.id) {
        ctx.fail({ code: 1001, msg: 'id不能为空' });
        return;
    }
    const res = await AdminModel.destroy({
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
  
module.exports = { adminList,admin,addAdmin,login,updateAdmin,deleteAdmin,updatePassword };