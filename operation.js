const query = require('./mysql')

exports.newArticle = function (article, classify, tag) {
    var article_id, class_id, tag_id
    // const test = `SELECT MAX(id) FROM test`

    // 插入分类信息
    const insert_c = `INSERT INTO classify(class_name,class_del) VALUES(?,'0')`
    query(insert_c, classify, function (err, res) {
        if (err) {
            console.log(err.message)
        }
        console.log('1')
    })
    // 插入文章信息
    const insert_a = `INSERT INTO article(article_topic,article_content,article_date,article_del,class_id) VALUES(?,?,?,'0',(SELECT MAX(class_id) FROM classify))`
    query(insert_a, article, function (err, res) {
        if (err) {
            console.log(err.message)
        }
        console.log('2')
    })
    // 插入标签信息
    const insert_t = `INSERT INTO tag(tag_name,tag_del) VALUES(?,'0')`
    query(insert_t, tag, function (err, res) {
        if (err) {
            console.log(err.message)
        }
        console.log('3')
    })
    // 插入文章和标签映射信息
    const insert_a_t = `INSERT INTO a_t(article_id,tag_id) VALUES((SELECT MAX(article_id) FROM article),(SELECT MAX(tag_id) FROM tag))`
    query(insert_a_t, tag, function (err, res) {
        if (err) {
            console.log(err.message)
        }
        console.log('4')
    })
}

exports.getArticle = function (id, callback) {
    const sql = `SELECT article.*,classify.* FROM article,classify WHERE article_id=` + id + ` AND article.class_id=classify.class_id`
    let message
    query(sql, id, function (err, res) {
        if (err) {
            console.log(err.message)
        } else {
            callback(res[0])
        }
    })
}