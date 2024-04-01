const sequelize = require("../config/db")

const { DataTypes } = require('sequelize');

const Thumb = sequelize.define('thumb', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 主键
        autoIncrement: true, // 自增
        allowNull: false, // 不为空
        comment: 'id',
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '用户ID',
    },
    aid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '文章ID',
    },
    cid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '评论ID',
    },
    create_time: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '创建时间',
    },
},{
    // 定义模型的索引
    indexes: [
        // 针对id字段的索引
        { unique: true, fields: ['id'] },
        // 针对uid和aid字段的组合索引
        { unique: false, fields: ['uid', 'aid'] },
        // 针对cid字段的索引
        { unique: false, fields: ['cid'] },
    ]
})



module.exports = Thumb;