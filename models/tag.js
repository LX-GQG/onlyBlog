const {Sequelize, DataTypes} = require('sequelize')
const sequelize = require("../config/db")

// 数据类型 https://www.sequelize.com.cn/core-concepts/model-basics#%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B
const Tag = sequelize.define('tag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 主键
        autoIncrement: true, // 自增
        allowNull: false, // 不为空
        comment: 'id',
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '标签名',
    },
})

module.exports = Tag