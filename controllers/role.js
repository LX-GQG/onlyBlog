const db = require('../config/dbContent');
const PermissionModel = require('../models/permission');
const RoleModel = require('../models/role');
const { Op } = require('sequelize');

const roleList = async (ctx) => {
    RoleModel.belongsToMany(PermissionModel, { through: 'role_permission', foreignKey: 'rid', otherKey: 'pid' });
    // 基于through表查询,分页查询
    const post = ctx.request.body;
    const pageNo = post.pageNo || 1;
    const pageSize = post.pageSize || 10;
    const res = await RoleModel.findAndCountAll({
        include: [{
            model: PermissionModel,
            through: {
                attributes: ['pid']
            }
        }],
        offset: (pageNo - 1) * pageSize,
        limit: pageSize,
    });
    ctx.success({ msg: "查询成功", data: res });
}

const addRole = async (ctx) => {
    const post = ctx.request.body;
    if(!post.role_type) {
        ctx.fail({ code: 1001, msg: '角色名不能为空' });
        return;
    }
    const res = await RoleModel.create({
        role_type: post.role_type,
        remark: post.remark || ''
    });
    if(res) {
        ctx.success({ msg: '添加成功' });
    } else {
        ctx.fail({ code: 1001, msg: '添加失败' });
    }
}

// 修改角色只能修改角色名和备注
const updateRole = async (ctx) => {
    const post = ctx.request.body;
    if(!post.id || !post.role_type) {
        ctx.fail({ code: 1001, msg: '参数不能为空' });
        return;
    }
    const res = await RoleModel.update({
        role_type: post.role_type,
        remark: post.remark
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

// 获取指定角色的权限id
const getRolePermission = async (ctx) => {
    const post = ctx.request.body;
    if(!post.id) {
        ctx.fail({ code: 1001, msg: 'id不能为空' });
        return;
    }
    RoleModel.belongsToMany(PermissionModel, { through: 'role_permission', foreignKey: 'rid', otherKey: 'pid' });
    const res = await RoleModel.findAll({
        include: [{
            model: PermissionModel,
            through: {
                attributes: ['rid', 'pid']
            }
        }],
        where: {
            id: post.id
        }
    });
    res.forEach(item => {
        item.dataValues.permission = [];
        item.dataValues.permissions.forEach(item2 => {
            item.dataValues.permission.push(item2.id);
        });
        delete item.dataValues.permissions;
    });
    ctx.success({ msg: "查询成功", data: res });
}

// 修改角色权限
const updateRolePermission = async (ctx) => {
    const post = ctx.request.body;
    if(!post.id || !post.permission) {
        ctx.fail({ code: 1001, msg: '参数不能为空' });
        return;
    }
    
    if(res) {
        ctx.success({ msg: '修改成功' });
    } else {
        ctx.fail({ code: 1001, msg: '修改失败' });
    }
}

// 删除角色
const deleteRole = async (ctx) => {
    const post = ctx.request.body;
    if(!post.id) {
        ctx.fail({ code: 1001, msg: '参数不能为空' });
        return;
    }
    const res = await RoleModel.destroy({
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

module.exports = {
    roleList,
    addRole,
    updateRole,
    deleteRole,
    getRolePermission,
    updateRolePermission
}

