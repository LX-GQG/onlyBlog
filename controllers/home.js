const path = require('path');

const home = async (ctx) => {
    ctx.body = "hello world";
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
  
module.exports = { home, upload, editorUpload, uploadImg };