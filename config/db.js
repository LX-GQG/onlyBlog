const Sequelize = require('sequelize');
const config = require('./config').database;

console.log('init sequelize...');

const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'mysql',
    pool: {
        max: 5, // 最大连接数
        min: 0, // 最小连接数
        idle: 30000, // 一个连接池10s之内没有被使用则释放
    },
    // 设置时区，时间格式化
    dialectOptions: {
        // 字符集
        charset: 'utf8mb4',
        // collate: 'utf8mb4_unicode_ci',
        // 时区
        dateStrings: true,
        typeCast: true,
    },
    define: {
        timestamps: false, // 默认为true，false则不会自动添加createdAt、updatedAt字段
        freezeTableName: true, // 默认为false，false则会自动在表名后添加s
    },
    timezone: config.timezone, // 东八时区
});

// 测试连接
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;