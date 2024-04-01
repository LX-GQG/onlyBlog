const path = require('path');
const sequelize = require('sequelize')
const { Op } = require('sequelize')
const moment = require('moment');
const DetectModel = require('../models/detect');
const LotteryModel = require('../models/lottery');
const { getClientIP } = require('../utils/ip');

const home = async (ctx) => {
    ctx.body = ctx;
};

const upload = async (ctx) => {
    // 获取上传文件
    const file = ctx.request.files.file;
    // 创建可读流
    const basename = path.basename(file.filepath)
    // 返回保存的路径
    ctx.body = { url: `${ctx.origin}/upload/${basename}` };
};

// 编辑器上传图片
const editorUpload = async (ctx) => {
    // 获取上传文件
    const file = ctx.request.files.file;
    // 创建可读流
    const basename = path.basename(file.filepath)
    // 返回保存的路径
    ctx.body = { link:`${ctx.origin}/upload/${basename}` };
};

// 前台上传图片
const uploadImg = async (ctx) => {
    // 获取上传文件
    const file = ctx.request.files.file;
    // 创建可读流
    const basename = path.basename(file.filepath)
    // 返回保存的路径
    ctx.body = { url: `${ctx.origin}/upload/${basename}` };
};

// 数据埋点
const detect = async (ctx) => {
    let result;
    if (ctx.request.body.barch) {
        let barch = ctx.request.body.barch
        for (let i = 0; i < barch.length; i++) {
            const ip = getClientIP(ctx);
            barch[i].ip = ip;
            // target 可能会过长
            const MAX_LENGTH = 255
            if (barch[i].length > MAX_LENGTH) {
                barch[i].target = barch[i].target.substring(0, MAX_LENGTH) + '...'
            }
            result = await DetectModel.create(barch[i])
        }
        if(result) {
            ctx.success({ msg: '埋点成功' });
        } else {
            ctx.fail({ code: 1001, msg: '埋点失败' });
        }
    }
}

// 获取数据埋点 图标数据
const detectChart = async (ctx) => {
    try {
        const today = moment().startOf('day'); // 今天的起始时间
        const yesterday = moment().subtract(1, 'days').startOf('day');  // 昨天的起始时间
        const twoDaysAgo = moment().subtract(2, 'days').startOf('day'); // 前天的起始时间
        
        const todayResult = await DetectModel.findAll({
            attributes: ['ip', 'browser', [sequelize.fn('COUNT', sequelize.col('ip')), 'count']],
            where: {
                type: 'click',
                current_time: {
                    [Op.between]: [today, moment()]
                }
            },
            group: ['ip','browser']
        });

        const yesterdayResult = await DetectModel.findAll({
            attributes: ['ip', 'browser', [sequelize.fn('COUNT', sequelize.col('ip')), 'count']],
            where: {
                type: 'click',
                current_time: {
                    [Op.between]: [yesterday, today]
                }
            },
            group: ['ip','browser']
        });

        const twoDaysAgoResult = await DetectModel.findAll({
            attributes: ['ip', 'browser', [sequelize.fn('COUNT', sequelize.col('ip')), 'count']],
            where: {
                type: 'click',
                current_time: {
                    [Op.between]: [twoDaysAgo, yesterday]
                }
            },
            group: ['ip','browser']
        })

        ctx.success({
            msg: '获取每个IP近三天的次数成功',
            data: {
                today: todayResult,
                yesterday: yesterdayResult,
                twoDaysAgo: twoDaysAgoResult
            }
        });
    } catch (error) {
        ctx.fail({ msg: '获取每个IP近三天的次数失败', data: error });
    }
}

// 获取所有的埋点 分页
const detectList = async (ctx) => {
    try {
        const post = ctx.request.body;
        const where = {};
        if (post.ip) {
            where.ip = {
                [Op.like]: `%${post.ip}%`
            };
        }
        if (post.type) {
            where.type = {
                [Op.like]: `%${post.type}%`
            };
        }
        if (post.startDate && post.endDate) {
            where.current_time = {
                [Op.between]: [post.startDate, post.endDate]
            };
        }
        const pageNo = post.pageNo || 1;
        const pageSize = post.pageSize || 10;
        const result = await DetectModel.findAndCountAll({
            limit: pageSize,
            offset: (pageNo - 1) * pageSize,
            order: [['current_time', 'DESC']],
            where: where,
        })
        ctx.success({ msg: '获取所有的埋点分页成功', data: result });
    } catch (error) {
        ctx.fail({ msg: '获取所有的埋点分页失败', data: error });
    }
}

const lottery = async (ctx) => {
    try {
        const post = ctx.request.body;
        const ip = getClientIP(ctx);
        post.ip = ip;
        await LotteryModel.create(post);
        ctx.success({ msg: '抽奖成功' });
    } catch (error) {
        ctx.fail({ msg: '抽奖失败', data: error });
    }
}

const lotteryList = async (ctx) => {
    try {
        const post = ctx.request.body;
        const where = {};
        if (post.ip) {
            where.ip = {
                [Op.like]: `%${post.ip}%`
            };
        }
        if (post.startDate && post.endDate) {
            where.current_time = {
                [Op.between]: [post.startDate, post.endDate]
            }
        }
        const pageNo = post.pageNo || 1;
        const pageSize = post.pageSize || 10;
        const result = await LotteryModel.findAndCountAll({
            limit: pageSize,
            offset: (pageNo - 1) * pageSize,
            order: [['current_time', 'DESC']],
            where: where
        });
        ctx.success({ msg: '获取抽奖列表成功', data: result });
    } catch (error) {
        ctx.fail({ msg: '获取抽奖列表失败', data: error });
    }
}
  
module.exports = { home, upload, editorUpload, uploadImg, detect, detectList, detectChart, lottery, lotteryList };