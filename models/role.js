const {Sequelize, DataTypes} = require('sequelize')
const sequelize = require("../config/db")

const User = require('./user')

// 数据类型 https://www.sequelize.com.cn/core-concepts/model-basics#%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B
const Role = sequelize.define('role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 主键
        autoIncrement: true, // 自增
        allowNull: false, // 不为空
        comment: 'id',
    },
    role_type: DataTypes.STRING,
    remark: DataTypes.STRING
})

module.exports = Role