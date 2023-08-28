const db = require('../config/dbContent');
const permissionModel = require('../models/permission');
const roleModel = require('../models/role');
const menuModel = require('../models/menu');
const { Op } = require('sequelize');

// 定义一个递归函数，将权限数据转换成树形结构
const convertToTreeData = (data) => {
    // 将权限数据转换成树形结构
    const treeData = [];
    data.forEach(item => {
        if(item.pid === 0) {
            treeData.push(item);
        }
    });
    const toTree = (items) => {
        items.forEach(item => {
            item.dataValues.children = [];
            data.forEach(i => {
                if(i.pid === item.id) {
                    item.dataValues.children.push(i);
                }
            });
            if(item.dataValues.children.length > 0) {
                toTree(item.dataValues.children);
            }
        });
    }
    toTree(treeData);
    return treeData;
}

// 权限列表
const permissionList = async (ctx) => {
    const res = await permissionModel.findAll();
    // 将权限数据转换成树形结构
    const treeData = convertToTreeData(res);
    // 获取角色权限
    const post = ctx.request.body;
    const rolePermission = [];
    if(post.id) {
        roleModel.belongsToMany(permissionModel, { through: 'role_permission', foreignKey: 'rid', otherKey: 'pid' });
        const res2 = await roleModel.findAll({
            include: [{
                model: permissionModel,
                through: {
                    attributes: ['rid', 'pid']
                }
            }],
            where: {
                id: post.id
            }
        });
        res2.forEach(item => {
            item.dataValues.permissions.forEach(item2 => {
                rolePermission.push(item2.id);
            });
        });
    }
    // 根据权限id将checked设置为true，如果有一个子权限被选中，父权限也要被选中
    const setChecked = (data) => {
        data.forEach(item => {
            if(rolePermission.indexOf(item.id) !== -1) {
                item.dataValues.checked = true;
                // 将当前子权限的父权限设置为true
                data.forEach(item2 => {
                    if(item2.id === item.pid) {
                        item2.dataValues.checked = true;
                    }
                });
            } else {
                item.dataValues.checked = false;
            }
            if(item.dataValues.children.length > 0) {
                setChecked(item.dataValues.children);
            }
        });
    }
    setChecked(treeData);


    ctx.success({ msg: "查询成功", data: treeData });
}

// 分配权限
const assignPermission = async (ctx) => {
    const post = ctx.request.body;
    if(!post.id) {
        ctx.fail({ code: 1001, msg: 'id不能为空' });
        return;
    }
    if(!post.permission) {
        ctx.fail({ code: 1001, msg: '权限不能为空' });
        return;
    }
    // 先删除该角色的所有权限
    await db.query(`delete from role_permission where rid = ${post.id}`);
    // 再添加新的权限
    const values = [];
    post.permission.forEach(item => {
        values.push(`(${post.id}, ${item})`);
    });
    // 一个个插入，如果一次性插入多条，会报错
    const res = await db.query(`insert into role_permission (rid, pid) values ${values.join(',')}`);
    
    ctx.success({ msg: "分配成功", data: res });
}

// 获取指定角色的权限
const getRolePermission = async (ctx) => {
    const post = ctx.request.body;
    if(!post.id) {
        ctx.fail({ code: 1001, msg: 'id不能为空' });
        return;
    }
    permissionModel.belongsToMany(roleModel, { through: 'role_permission', foreignKey: 'pid', otherKey: 'rid' });
    const res = await permissionModel.findAll({
        include: [{
            model: roleModel,
            through: {
                attributes: ['rid', 'pid']
            }
        }],
        where: {
            id: post.id
        }
    });
    ctx.success({ msg: "查询成功", data: res });
}

// 获取菜单权限
const getMenuPermission = async (ctx) => {
    // 根据token获取用户信息
    const user = ctx.state.user;
    const rid = user.userinfo.rid;
    
    // 根据角色id获取权限id
    if (rid === 0) {
        const res = await permissionModel.findAll({
            where: {
                ismenu: 1
            }
        });
        // 将权限数据转换成树形结构
        const treeData = convertToTreeData(res);
        // 超级管理员，获取所有菜单
        ctx.success({ msg: "查询成功", data: treeData });
    } else {
        const res2 = await db.query(`select pid from role_permission where rid = ${rid}`);
        const permission = res2.map(item => item.pid);
        // 根据权限id获取is_menu为1的菜单
        const res3 = await permissionModel.findAll({
            where: {
                id: {
                    [Op.in]: permission
                },
                ismenu: 1
            }
        });
        // 将权限数据转换成树形结构
        const treeData = convertToTreeData(res3);
        ctx.success({ msg: "查询成功", data: treeData });
    }
    
}


module.exports = {
    permissionList,
    getRolePermission,
    assignPermission,
    getMenuPermission
}