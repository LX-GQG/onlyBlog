const sequelize = require("../config/db")

const { DataTypes } = require('sequelize');

const Permissions = sequelize.define('permission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 主键
        autoIncrement: true, // 自增
        allowNull: false, // 不为空
        comment: 'id',
    },
    rid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'rid',
    },
    pid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'pid',
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '权限名称',
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '权限路径',
    },
    ismenu: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        comment: '是否是菜单',
    },
    checked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: '是否选中',
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '图标',
    },
}, {
    underscored: true,
    //timestamps: false,
    //paranoid: true,
    freezeTableName: true, // 为 true 则表的名称和 model 相同
    charset: 'utf8'
})

module.exports = Permissions;