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
})



module.exports = Thumb;