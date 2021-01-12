const query = require('./mysql')

// 保存 ip 访问地址
exports.IPAddress = function (ip) {
    const sql = `INSERT INTO ip(ip) SELECT '` + ip + `' FROM DUAL WHERE NOT EXISTS (SELECT ip FROM ip WHERE ip='` + ip + `')`

    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        }
    })
}

// 新建文章
exports.newArticle = function (article, classify, tag) {
    function InsertC () {
        const promise1 = new Promise(function (resolve, reject) {
            // 插入分类信息
            const insert_c = `INSERT INTO classify(class_name,class_del) SELECT '` + classify + `','0' FROM DUAL WHERE NOT EXISTS (SELECT class_name FROM classify WHERE class_name='` + classify + `')`
            query(insert_c, classify, function (err, res) {
                if (err) {
                    reject('error')
                } else {
                    resolve('success')
                }
            })
        })
        return promise1
    }

    function InsertA () {
        const promise2 = new Promise(function (resolve, reject) {
            // 插入文章信息
            const insert_a = `INSERT INTO article(article_topic,article_content,article_date,article_contentmd,article_del,class_id,clickcount) VALUES(?,?,?,?,'0',(SELECT class_id FROM classify WHERE class_name='` + classify + `'),'0')`
            query(insert_a, article, function (err, res) {
                if (err) {
                    reject('error')
                } else {
                    resolve('success')
                }
            })
        })
        return promise2
    }
    
    function InsertT () {
        const promise3 = new Promise(function (resolve, reject) {
            // 遍历保存多个标签的数组插入标签信息
            let sql = ''
            tag.forEach(function (item) {
                sql += `INSERT INTO tag(tag_name,tag_del) SELECT '` + item + `','0' FROM DUAL WHERE NOT EXISTS (SELECT tag_name FROM tag WHERE tag_name='` + item + `');`
            })
            query(sql, function (err, res) {
                if (err) {
                    reject('error')
                }
            })
            resolve('success')
        })
        return promise3
    }

    function InsertAT () {
        const promise4 = new Promise(function (resolve, reject) {
            // 遍历插入文章和标签映射信息
            let sql = ''
            tag.forEach(function (item) {
                sql += `INSERT INTO a_t(article_id,tag_id) VALUES((SELECT MAX(article_id) FROM article),(SELECT tag_id FROM tag WHERE tag_name='` + item + `'));`
            })
            query(sql, function (err, res) {
                if (err) {
                    reject('error')
                }
            })
            resolve('success')
        })
        return promise4
    }
    // 使用 promise 链式调用实现异步插入操作
    InsertC().then(function () {
        return InsertA()
    }).then(function () {
        return InsertT()
    }).then(function () {
        return InsertAT()
    })
}

// 获取单个文章信息
exports.getOneArticle = function (id, callback) {
    // 查询文章信息及其分类
    const a_c = `SELECT article.*,classify.* FROM article,classify WHERE article_id=` + id + ` AND article.class_id=classify.class_id`
    // 查询文章标签信息
    const a_t = `SELECT tag.tag_name, tag.tag_id FROM tag,article,a_t WHERE article.article_id=` + id + ` AND article.article_id=a_t.article_id AND a_t.tag_id=tag.tag_id`
    const sql = a_c + `;` + a_t

    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        } else {
            callback(res)
        }
    })
}

// 获取文章分页信息
exports.getArticlePage = function (pageNum, callback) {
    // 文章查询的起始位置
    start = (pageNum - 1) * 10
    // 查询文章信息及其分类
    const onePage = `SELECT article.*,classify.class_name FROM article,classify WHERE article.class_id=classify.class_id AND article_del<>1 ORDER BY article_date DESC LIMIT ` + start + `,` + 10
    // 查询文章总数
    const totalPage = `SELECT COUNT(article_id) AS pageCount FROM article WHERE article_del<>1`
    const sql = onePage + `;` + totalPage
    
    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        } else {
            // 获取总页数
            let page = res[1][0].pageCount
            page = page % 10 == 0 ? page / 10 : Math.ceil(page / 10)
            // 将页数转换为数组，方便前端模板渲染
            const totalPages = []
            for (let i = 0; i < page; i++) {
                totalPages.push(i)
            }
            res[1] = totalPages
            callback(res)
        }
    })
}

// 获取分类信息
exports.getClass = function (callback) {
    // 获取指定的分类信息
    const classify = `SELECT class_id,class_name FROM classify GROUP BY class_name`
    // 获取分类数量
    const count = `SELECT COUNT(class_id) AS count FROM classify`
    const sql = classify + ';' + count

    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        } else {
            callback(res)
        }
    })
}

// 获取分类对应文章
exports.getArticleC = function (id, pageNum, callback) {
    // 根据分页获取数据范围
    start = (pageNum - 1) * 20
    // 根据分类 id 按时间倒序查询对应文章
    const article = `SELECT article_id,article_date,article_topic FROM article WHERE class_id=` + id + ` AND article_del<>1 ORDER BY article_date DESC LIMIT ` + start + `,` + 20
    // 查询分类名称
    const className = `SELECT class_name FROM classify WHERE class_id=` + id
    // 查询分类对应的文章总数
    const count = `SELECT COUNT(article_id) AS count FROM article WHERE class_id=` + id + ` AND article_del<>1`
    const sql = article + `;` + className + `;` + count

    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        } else {
            let page = res[2][0].count
            res[3] = res[2][0].count
            page = page % 20 == 0 ? page / 20 : Math.ceil(page / 20)
            // 将页数转换为数组，方便前端模板渲染
            const totalPages = []
            for (let i = 0; i < page; i++) {
                totalPages.push(i)
            }
            res[2] = totalPages
            callback(res)
        }
    })
}

// 获取归档信息
exports.getArchive = function (pageNum, callback) {
    // 根据分页获取数据范围
    start = (pageNum - 1) * 20
    // 按时间倒序查询归档信息
    const getArchive = `SELECT article_id,article_topic,article_date FROM article WHERE article_del<>1 ORDER BY article_id DESC LIMIT ` + start + `,` + 20
    // 获取年份信息
    const getYear = `SELECT left(article_date,4) as years FROM (` + getArchive + `) AS A WHERE article_date GROUP BY left(article_date,4)`
    // 获取文章总数
    const count = `SELECT COUNT(article_id) AS count FROM article WHERE article_del<>1`
    sql = getArchive + ';' + getYear + `;` + count

    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        } else {
            let page = res[2][0].count
            res[3] = res[2][0].count
            page = page % 20 == 0 ? page / 20 : Math.ceil(page / 20)
            // 将页数转换为数组，方便前端模板渲染
            const totalPages = []
            for (let i = 0; i < page; i++) {
                totalPages.push(i)
            }
            res[2] = totalPages
            callback(res)
        }
    })
}

// 获取标签信息
exports.getTag = function (callback) {
    // 获取全部标签信息
    const tag = `SELECT tag_id,tag_name FROM tag GROUP BY tag_name`
    // 获取标签数量
    const count1 = `SELECT COUNT(tag_id) AS count FROM tag`
    // 获取每个标签对应文章数量
    const count2 = `SELECT tag_id,COUNT(tag_id) AS count FROM a_t GROUP BY tag_id`
    const sql = tag + ';' + count1 + ';' + count2

    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        } else {
            callback(res)
        }
    })
}

// 获取标签对应文章
exports.getArticleT = function (id, pageNum, callback) {
    // 根据分页获取数据范围
    start = (pageNum - 1) * 20
    // 根据标签 id 按时间倒序查询对应文章
    const article = `SELECT article.article_id,article_date,article_topic FROM article,a_t,tag WHERE article.article_id=a_t.article_id AND tag.tag_id=a_t.tag_id AND tag.tag_id=` + id + ` AND article_del<>1 ORDER BY article_date DESC LIMIT ` + start + `,` + 20
    // 查询标签名称
    const tagName = `SELECT tag_name FROM tag WHERE tag_id=` + id
    // 查询标签对应的文章总数
    const count = `SELECT COUNT(a_t.article_id) AS count FROM article,a_t,tag WHERE article.article_id=a_t.article_id AND tag.tag_id=a_t.tag_id AND tag.tag_id=` + id + ` AND article_del<>1`
    const sql = article + `;` + tagName + `;` + count
    
    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        } else {
            let page = res[2][0].count
            res[3] = res[2][0].count
            page = page % 20 == 0 ? page / 20 : Math.ceil(page / 20)
            // 将页数转换为数组，方便前端模板渲染
            const totalPages = []
            for (let i = 0; i < page; i++) {
                totalPages.push(i)
            }
            res[2] = totalPages
            callback(res)
        }
    })
}

// 获取文章操作数据
exports.getArticleOps = function (pageNum, callback) {
    start = (pageNum - 1) * 20
    // 获取文章信息
    const article = `SELECT article.article_id,article_topic,article_date,class_name FROM article,classify WHERE article.class_id=classify.class_id AND article_del<>1 LIMIT ` + start + ',' + 20
    // 获取标签文章映射信息
    const a_t = `SELECT article_id,tag_name FROM tag,a_t WHERE tag.tag_id=a_t.tag_id`
    // 获取文章总数
    const count = `SELECT COUNT(article_id) AS count FROM article WHERE article_del<>1`
    const sql = article + `;` + count + ';' + a_t

    query(sql, function(err, res) {
        if (err) {
            console.log(err.message)
        } else {
            let page = res[1][0].count
            page = page % 20 == 0 ? page / 20 : Math.ceil(page / 20)
            // 将页数转换为数组，方便前端模板渲染
            const totalPages = []
            for (let i = 0; i < page; i++) {
                totalPages.push(i)
            }
            res[1] = totalPages
            callback(res)
        }
    })
}

// 文章修改
exports.articleRevise = function (article, classify, tag) {
    function InsertC () {
        const promise1 = new Promise(function (resolve, reject) {
            // 修改分类信息
            const insert_c = `INSERT INTO classify(class_name,class_del) SELECT '` + classify + `','0' FROM DUAL WHERE NOT EXISTS (SELECT class_name FROM classify WHERE class_name='` + classify + `')`
            query(insert_c, classify, function (err, res) {
                if (err) {
                    reject('error')
                } else {
                    resolve('success')
                }
            })
        })
        return promise1
    }

    function InsertA () {
        const promise2 = new Promise(function (resolve, reject) {
            // 修改文章信息
            const insert_a = `UPDATE article SET article_topic='` + article[1] + `',article_content='` + article[2] + `',article_contentmd='` + article[3] + `',revise_date='` + article[4] + `',class_id=(SELECT class_id FROM classify WHERE class_name='` + classify + `') WHERE article_id=` + article[0]

            query(insert_a, article, function (err, res) {
                if (err) {
                    reject('error')
                } else {
                    resolve('success')
                }
            })
        })
        return promise2
    }
    
    function InsertT () {
        const promise3 = new Promise(function (resolve, reject) {
            // 遍历保存多个标签的数组插入标签信息
            let sql = ''
            tag.forEach(function (item) {
                sql += `INSERT INTO tag(tag_name,tag_del) SELECT '` + item + `','0' FROM DUAL WHERE NOT EXISTS (SELECT tag_name FROM tag WHERE tag_name='` + item + `');`
            })

            query(sql, function (err, res) {
                if (err) {
                    console.log(err.message)
                }
            })
            resolve('success')
        })
        return promise3
    }

    function InsertAT () {
        const promise4 = new Promise(function (resolve, reject) {
            // 遍历修改文章和标签映射信息
            let sql1 = `DELETE FROM a_t WHERE article_id=` + article[0]

            let sql2 = ''
            tag.forEach(function (item) {
                sql2 += `INSERT INTO a_t(article_id,tag_id) VALUES('` + article[0] + `',(SELECT tag_id FROM tag WHERE tag_name='` + item + `'));`
            })

            let sql = sql1 + ';' + sql2

            query(sql, function (err, res) {
                if (err) {
                    console.log(err.message)
                }
            })
            resolve('success')
        })
        return promise4
    }
    // 使用 promise 链式调用实现异步插入操作
    InsertC().then(function () {
        return InsertA()
    }).then(function () {
        return InsertT()
    }).then(function () {
        return InsertAT()
    })
}

// 文章回收
exports.articleThrow = function (id, callback) {
    const sql = `UPDATE article SET article_del=1 WHERE article_id=` + id

    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        }
    })
}

// 获取个人信息
exports.getPersonal = function (callback) {
    const sql = `SELECT * from personal WHERE id=(SELECT MAX(id) FROM personal)`

    query(sql, function(err, res) {
        if (err) {
            console.log(err.message)
        } else {
            callback(res[0])
        }
    })
}

// 个人信息修改
exports.revisePersonal = function (mes, callback) {
    const sql = `INSERT INTO personal(name,intro,link1,link2,link3,img) VALUES(?,?,?,?,?,?)`

    query(sql, mes, function (err,res) {
        if (err) {
            console.log(err.message)
        }
    })
}

// 获取回收站文章
exports.getRecycle = function (pageNum, callback) {
    start = (pageNum - 1) * 20
    // 获取文章信息
    const article = `SELECT article.article_id,article_topic,article_date,class_name FROM article,classify WHERE article.class_id=classify.class_id AND article_del=1 LIMIT ` + start + ',' + 20
    // 获取标签文章映射信息
    const a_t = `SELECT article_id,tag_name FROM tag,a_t WHERE tag.tag_id=a_t.tag_id`
    // 获取文章总数
    const count = `SELECT COUNT(article_id) AS count FROM article WHERE article_del=1`
    const sql = article + `;` + count + ';' + a_t

    query(sql, function(err, res) {
        if (err) {
            console.log(err.message)
        } else {
            let page = res[1][0].count
            page = page % 20 == 0 ? page / 20 : Math.ceil(page / 20)
            // 将页数转换为数组，方便前端模板渲染
            const totalPages = []
            for (let i = 0; i < page; i++) {
                totalPages.push(i)
            }
            res[1] = totalPages
            callback(res)
        }
    })
}

// 回收站文章恢复
exports.articleRecover = function (id, callback) {
    const sql = `UPDATE article SET article_del=0 WHERE article_id=` + id

    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        }
    })
}

// 回收站文章删除
exports.articleDelete = function (id, callback) {
    const sql = `DELETE FROM article WHERE article_id=` + id

    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        }
    })
}

// 文章查询
exports.articleSearch = function (str, callback) {
    const mes = `SELECT *,class_name FROM article,classify WHERE article_topic LIKE '%` + str + `%' AND article.class_id=classify.class_id`
    const count = `SELECT COUNT(article_id) AS count FROM article WHERE article_topic LIKE '%` + str + `%'`

    const sql = mes + ';' + count
    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        } else {
            callback(res)
        }
    })
}

// 文章点击
exports.articleClick = function (id) {
    const sql = `UPDATE article SET clickcount=clickcount+1 WHERE article_id=` + id

    query(sql, function (err ,res) {
        if (err) {
            console.log(err.message)
        }
    })
}

// 文章点击排序获取
exports.articleSort = function (callback) {
    const sql = `SELECT * FROM article ORDER BY clickcount DESC LIMIT 0,10`

    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        } else {
            callback(res)
        }
    })
}

// 访客数查询
exports.getVisitors = function (callback) {
    const sql = `SELECT COUNT(ip) AS count FROM ip`

    query(sql, function(err, res) {
        if (err) {
            console.log(err.message)
        } else {
            callback(res)
        }
    })
}

// 日点击量统计
exports.clickCount = function (date) {
    const sql1 = `INSERT INTO click(date, count) SELECT '` + date + `',0 FROM DUAL WHERE NOT EXISTS (SELECT date FROM click WHERE date='` + date + `')`
    const sql2 = `UPDATE click SET count=count+1 WHERE date='` + date + `'`
    const sql = sql1 + ';' +sql2

    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        }
    })
}

// 总点击量获取
exports.totalCount = function (callback) {
    const sql = `SELECT SUM(count) AS sum FROM click`

    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        } else {
            callback(res)
        }
    })
}

// 获取近一周点击数据
exports.weeklyCount = function (callback) {
    const sql = `SELECT * FROM click ORDER BY date DESC LIMIT 0,7`

    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        } else {
            callback(res)
        }
    })
}

// 用户登录判断
exports.userLogin = function (username, password, callback) {
    const sql = `SELECT * FROM user WHERE username='` + username + `' AND password='` + password + `'`

    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        } else {
            callback(res)
        }
    })
}