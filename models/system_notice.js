const sequelize = require("../config/db")

const { DataTypes } = require('sequelize');

const systemNotice = sequelize.define('system_notice', {
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
        field: 'title',
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'content',
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'type',
    },
    receive_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'receive_id',
    },
    create_time: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'create_time',
    },
}, {
    underscored: true,
    //timestamps: false,
    //paranoid: true,
    freezeTableName: true, // 为 true 则表的名称和 model 相同
    charset: 'utf8'
})



module.exports = systemNotice;