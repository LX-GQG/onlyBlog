const sequelize = require("../config/db")

const { Sequelize, DataTypes } = require('sequelize');

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
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '邮箱',
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'ip',
    },
    remark: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '备注',
    },
    create_time: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '创建时间',
    },
    update_time: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '更新时间',
    }
});

module.exports = User;