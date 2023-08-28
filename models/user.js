const sequelize = require("../config/db")

const { Sequelize, DataTypes } = require('sequelize');

// const Role = require('./role');

const User = sequelize.define('user', {
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
        // 验证
        validate: {
            // 验证用户名是否为空
            notNull: {
                msg: '用户名不能为空'
            },
            // 验证用户名长度
            len: {
                args: [2, 30],
                msg: '用户名长度为2-30个字符'
            }
        }
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

module.exports = User;