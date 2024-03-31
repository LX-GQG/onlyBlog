const Redis = require('ioredis');

// 创建 Redis 函数
function createRedis() {
    // Redis 实例
    const redisClient = new Redis({
        host: '120.76.205.83',
        port: 6379,
        password: 'lx973156',
        connectTimeout: 10000, // 连接超时时间
        lazyConnect: true, // 延迟连接
    });
    return redisClient;
}

module.exports = createRedis;