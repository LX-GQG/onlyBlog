const sequelize = require("../config/db")

const { DataTypes } = require('sequelize');

const Detect = sequelize.define('detect', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 主键
        autoIncrement: true, // 自增
        allowNull: false, // 不为空
        comment: 'id',
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '类型',
    },
    browser: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '浏览器类型',
    },
    delay: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '停留时间',
    },
    target: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '目标',
    },
    current_url: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '当前url',
    },
    current_time: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '当前时间',
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'ip',
    },
}, {
    underscored: true,
    //timestamps: false,
    //paranoid: true,
    freezeTableName: true, // 为 true 则表的名称和 model 相同
    charset: 'utf8'
})

module.exports = Detect;