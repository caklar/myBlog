const query = require('./mysql')

exports.newArticle = function (article, classify, tag) {
    const sql_a = `INSERT INTO article(article_topic,article_content,article_date,article_del) VALUES(?,?,?,'0')`
    const sql_c = `INSERT INTO classify(class_name,class_del) VALUES(?,'0')`
    const sql_t = `INSERT INTO tag(tag_name,tag_del) VALUES(?,'0')`
    query(sql_a, article, function (err, res) {
        if (err) {
            console.log(err.message)
        }
    })
    query(sql_c, classify, function (err, res) {
        if (err) {
            console.log(err.message)
        }
    })
    query(sql_t, tag, function (err, res) {
        if (err) {
            console.log(err.message)
        }
    })
}