const sequelize = require("../config/db")

const { DataTypes } = require('sequelize');

const AdminRoles = sequelize.define('admin_role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 主键
        autoIncrement: true, // 自增
        allowNull: false, // 不为空
        comment: 'id',
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'uid',
    },
    rid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'rid',
    }
}, {
    underscored: true,
    //timestamps: false,
    //paranoid: true,
    freezeTableName: true, // 为 true 则表的名称和 model 相同
    charset: 'utf8'
})



module.exports = AdminRoles;