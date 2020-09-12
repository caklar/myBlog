const mysql = require('mysql')

// 创建数据库连接
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123698745',
    database: 'blog'
})

// 操作
var query = function (sql, data, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(sql, data, function (qerr, back) {
                // 释放连接
                connection.release();
                // 事件驱动回调
                callback(qerr, back);
            });
        }
    });
};

module.exports = query;