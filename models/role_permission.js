const sequelize = require("../config/db")

const { DataTypes } = require('sequelize');

const RolesPermissions = sequelize.define('role_permission', {
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
    }
}, {
    underscored: true,
    //timestamps: false,
    //paranoid: true,
    freezeTableName: true, // 为 true 则表的名称和 model 相同
    charset: 'utf8'
})



module.exports = RolesPermissions;