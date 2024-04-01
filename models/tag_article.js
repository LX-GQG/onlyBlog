const sequelize = require("../config/db")

const { DataTypes } = require('sequelize');

const TagArticle = sequelize.define('tag_article', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 主键
        autoIncrement: true, // 自增
        allowNull: false, // 不为空
        comment: 'id',
    },
    tid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'tid',
    },
    aid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'aid',
    }
}, {
    underscored: true,
    //timestamps: false,
    //paranoid: true,
    freezeTableName: true, // 为 true 则表的名称和 model 相同
    charset: 'utf8'
}, {
    // 定义模型的索引
    indexes: [
        // 针对id字段的索引
        { fields: ['id'] },
        // 联合索引
        { fields: ['tid', 'aid'] },        
    ]
})



module.exports = TagArticle;