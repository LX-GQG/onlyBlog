const sequelize = require("../config/db")
const { Sequelize, DataTypes } = require('sequelize');

const Comment = sequelize.define('comment', {
    // 在这里定义模型属性
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 主键
        autoIncrement: true, // 自增
        allowNull: false, // 不为空
        comment: 'id',
    },
    aid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '文章ID',
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '用户ID',
    },
    pid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '父级评论ID',
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '评论内容',
    },
    create_time: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '创建时间',
    },
});

module.exports = Comment;