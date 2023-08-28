// const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// 将 UTC 时间转换为本地时间
const convertUTCToLocal = (utcTimestamp) => {
    const utcDate = new Date(utcTimestamp);
    const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
    return localDate;
}

function formatFullDateTime(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从0开始，所以要加1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}`;
}

// // 生成随机盐
// const salt = crypto.randomBytes(16).toString('hex');

// // 生成密码哈希
// function hashPassword(password) {
//   const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
//   return hash.toString('hex');
// }

// // 验证密码
// function verifyPassword(password, hashedPassword) {
//   const newHash = hashPassword(password);
//   return newHash === hashedPassword;
// }

// 生成密码哈希
async function hashPasswordAsync(password) {
    const hash = await bcrypt.hash(password, 10); // 定义迭代次数（工作因子），推荐设置为 10 或更高
    return hash;
}

// 验证密码
async function verifyPasswordAsync(password, hashedPassword) {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
}

module.exports = {
    convertUTCToLocal,
    formatFullDateTime,
    hashPasswordAsync,
    verifyPasswordAsync
}
  