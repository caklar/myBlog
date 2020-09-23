const query = require('./mysql')

// 新建文章
exports.newArticle = function (article, classify, tag) {
    // 插入分类信息
    const insert_c = `INSERT INTO classify(class_name,class_del) VALUES(?,'0')`
    query(insert_c, classify, function (err, res) {
        if (err) {
            console.log(err.message)
        }
        // 插入文章信息
        const insert_a = `INSERT INTO article(article_topic,article_content,article_date,article_del,class_id) VALUES(?,?,?,'0',(SELECT MAX(class_id) FROM classify))`
        query(insert_a, article, function (err, res) {
            if (err) {
                console.log(err.message)
            }
            // 插入标签信息
            const insert_t = `INSERT INTO tag(tag_name,tag_del) VALUES(?,'0')`
            query(insert_t, tag, function (err, res) {
                if (err) {
                    console.log(err.message)
                }
                // 插入文章和标签映射信息
                const insert_a_t = `INSERT INTO a_t(article_id,tag_id) VALUES((SELECT MAX(article_id) FROM article),(SELECT MAX(tag_id) FROM tag))`
                query(insert_a_t, tag, function (err, res) {
                    if (err) {
                        console.log(err.message)
                    }
                })
            })
        })
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
    const onePage = `SELECT article.*,classify.class_name FROM article,classify WHERE article.class_id=classify.class_id ORDER BY article_date DESC LIMIT ` + start + `,` + 10
    // 查询文章总数
    const totalPage = `SELECT COUNT(article_id) AS pageCount FROM article`
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
            // console.log(res)
            callback(res)
        }
    })
}

// 获取分类信息
exports.getClass = function (pageNum, callback) {
    // 根据分页获得数据范围
    start = (pageNum - 1) * 10
    // 获取指定的分类信息
    const sql = `SELECT class_id,class_name FROM classify GROUP BY class_name LIMIT ` + start + `,` + 20

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
    const article = `SELECT article_id,article_date,article_topic FROM article WHERE class_id=` + id + ` ORDER BY article_date DESC LIMIT ` + start + `,` + 20
    // 查询分类名称
    const className = `SELECT class_name FROM classify WHERE class_id=` + id
    // 查询分类对应的文章总数
    const count = `SELECT COUNT(article_id) AS count FROM article WHERE class_id=` + id
    const sql = article + `;` + className + `;` + count

    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        } else {
            let page = res[2][0].count
            page = page % 20 == 0 ? page / 20 : Math.ceil(page / 20)
            // 将页数转换为数组，方便前端模板渲染
            const totalPages = []
            for (let i = 0; i < page; i++) {
                totalPages.push(i)
            }
            res[2] = totalPages
            callback(res)
            // console.log(res)
        }
    })
}

// 获取归档信息
exports.getArchive = function (pageNum, callback) {
    // 根据分页获取数据范围
    start = (pageNum - 1) * 20
    // 按时间倒序查询归档信息
    const getArchive = `SELECT article_id,article_topic,article_date FROM article ORDER BY article_date DESC LIMIT ` + start + `,` + 20 
    // 获取年份信息
    const getYear = `SELECT left(article_date,4) as years FROM (` + getArchive + `) AS A WHERE article_date GROUP BY left(article_date,4)`
    // 获取文章总数
    const count = `SELECT COUNT(article_id) AS count FROM article`
    sql = getArchive + ';' + getYear + `;` + count

    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        } else {
            let page = res[2][0].count
            page = page % 20 == 0 ? page / 20 : Math.ceil(page / 20)
            // 将页数转换为数组，方便前端模板渲染
            const totalPages = []
            for (let i = 0; i < page; i++) {
                totalPages.push(i)
            }
            res[2] = totalPages
            // console.log(res)
            callback(res)
        }
    })
}

// 获取标签信息
exports.getTag = function (callback) {
    // 获取全部标签信息
    const sql = `SELECT tag_id,tag_name FROM tag GROUP BY tag_name`

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
    const article = `SELECT article.article_id,article_date,article_topic FROM article,a_t,tag WHERE article.article_id=a_t.article_id AND tag.tag_id=a_t.tag_id AND tag.tag_id=` + id + ` ORDER BY article_date DESC LIMIT ` + start + `,` + 20
    // 查询标签名称
    const tagName = `SELECT tag_name FROM tag WHERE tag_id=` + id
    // 查询标签对应的文章总数
    const count = `SELECT COUNT(a_t.article_id) AS count FROM article,a_t,tag WHERE article.article_id=a_t.article_id AND tag.tag_id=a_t.tag_id AND tag.tag_id=` + id
    const sql = article + `;` + tagName + `;` + count
    
    query(sql, function (err, res) {
        if (err) {
            console.log(err.message)
        } else {
            let page = res[2][0].count
            page = page % 20 == 0 ? page / 20 : Math.ceil(page / 20)
            // 将页数转换为数组，方便前端模板渲染
            const totalPages = []
            for (let i = 0; i < page; i++) {
                totalPages.push(i)
            }
            res[2] = totalPages
            callback(res)
            // console.log(res)
        }
    })
}
