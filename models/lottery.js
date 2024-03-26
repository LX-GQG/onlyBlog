const sequelize = require("../config/db")

const { DataTypes } = require('sequelize');

const Lottery = sequelize.define('lottery', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 主键
        autoIncrement: true, // 自增
        allowNull: false, // 不为空
        comment: 'id',
    },
    prizeName: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '奖品',
    },
    browser: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '浏览器类型',
    },
    current_time: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '当前时间',
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'ip',
    },
}, {
    //timestamps: false,
    //paranoid: true,
    freezeTableName: true, // 为 true 则表的名称和 model 相同
    charset: 'utf8'
})

module.exports = Lottery;