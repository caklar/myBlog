const mysql = require('mysql')

// 创建数据库连接
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123698745',
    database: 'blog',
    multipleStatements: true
})

// 操作
var query = function (sql, data, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err)
        } else {
            connection.query(sql, data, function (qerr, back) {
                // 事件驱动回调
                callback(qerr, back)
            });
        }
        // 释放连接
        pool.releaseConnection(connection)
    });
};

module.exports = query;