const sequelize = require("../config/db")

const { Sequelize, DataTypes } = require('sequelize');

const Article = sequelize.define('article', {
    // 在这里定义模型属性
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 主键
        autoIncrement: true, // 自增
        allowNull: false, // 不为空
        comment: 'id',
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '文章标题',
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '文章内容',
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '文章状态',
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '用户id',
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '管理员id',
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '文章类型',
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '用户名',
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
    },
});

module.exports = Article;