const config = require('./config').database;
const mysql = require('mysql2')

const pool = mysql.createPool({
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
    port: config.port,
    timezone: config.timezone
})

const query = function (sql) {
    return new Promise((resolve, reject) => {
        pool.execute(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        })
    })
}

module.exports = {
    query
}