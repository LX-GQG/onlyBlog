const sequelize = require("../config/db")

const { DataTypes } = require('sequelize');

const Menu = sequelize.define('menu', {
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
        comment: '菜单名称',
    },
    checked: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '是否选中',
    },
}, {
    underscored: true,
    //timestamps: false,
    //paranoid: true,
    freezeTableName: true, // 为 true 则表的名称和 model 相同
    charset: 'utf8'
})

module.exports = Menu;