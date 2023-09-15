const sequelize = require("../config/db")

const { Sequelize, DataTypes } = require('sequelize');

const Admin = sequelize.define('admin', {
    // 在这里定义模型属性
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 主键
        autoIncrement: true, // 自增
        allowNull: false, // 不为空
        comment: 'id',
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '用户名',
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '密码',
        // 验证
        validate: {
            // 验证密码是否为空
            notNull: {
                msg: '密码不能为空'
            },
        }
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '头像',
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'ip',
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '用户状态',
    },
    rid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '角色id',
    },
});

module.exports = Admin;