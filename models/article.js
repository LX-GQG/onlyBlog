const sequelize = require("../config/db")
const UserModel = require('./user');
const AdminModel = require('./admin');
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
    cover: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '文章封面',
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
    thumbs_num: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '点赞数',
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
}, {
    associations: {
        user: {
            type: DataTypes.BELONGS_TO,
            model: 'user',
            foreignKey: 'user_id',
        },
        admin: {
            type: DataTypes.BELONGS_TO,
            model: 'admin',
            foreignKey: 'admin_id',
        }
    },
}, {
    // 定义模型的索引
    indexes: [
        // 添加一个针对 title 字段的索引
        {
            name: 'idx_article_title',
            fields: ['title']
        },
        // 添加一个联合索引
        {
            name: 'idx_article_user_status',
            fields: ['user_id', 'thumbs_num']
        },
        // 添加一个联合索引
        {
            name: 'idx_article_admin_status',
            fields: ['admin_id', 'thumbs_num']
        }
    ]
});

module.exports = Article;