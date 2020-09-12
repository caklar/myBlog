const fs = require('fs')
const express = require('express')
var operation = require('./operation')

const router = express.Router()

// 跳转首页
router.get('/', function (req, res) {
    fs.readFile('./views/index.html', 'utf8', function (err, data) {
        if (err) {
            return res.status(500).send('error')
        } else {
            res.end(data)
        }
    })
})

// 跳转分类页面
router.get('/classify', function (req, res) {
    fs.readFile('./views/classify.html', 'utf8', function (err, data) {
        if (err) {
            return res.status(500).send('error')
        } else {
            res.end(data)
        }
    })
})

// 跳转归档界面
router.get('/archive', function (req, res) {
    fs.readFile('./views/archive.html', 'utf8', function (err, data) {
        if (err) {
            return res.status(500).send('error')
        } else {
            res.end(data)
        }
    })
})

// 跳转标签页面
router.get('/tag', function (req, res) {
    fs.readFile('./views/tag.html', 'utf8', function (err, data) {
        if (err) {
            return res.status(500).send('error')
        } else {
            res.end(data)
        }
    })
})

// 跳转关于页面
router.get('/about', function (req, res) {
    fs.readFile('./views/index.html', 'utf8', function (err, data) {
        if (err) {
            return res.status(500).send('error')
        } else {
            res.end(data)
        }
    })
})

// 
router.get('/a', function (req, res) {
    fs.readFile('./views/newArticle.html', 'utf8', function (err, data) {
        if (err) {
            return res.status(500).send('error')
        } else {
            res.end(data)
        }
    })
})

router.get('/article/:id', function (req, res) {
    let id = req.params.id
    operation.getArticle(id, function (message) {
        res.render('article.html', {
            topic: message.article_topic,
            content: message.article_content,
            date: message.article_date,
            className: message.class_name
        });
    })
})

// 新建文章提交
router.post('/newArticle', function (req,res) {
    // 获取并格式化当前时间
    let nowDate = new Date();
    let year = nowDate.getFullYear()
    let month = nowDate.getMonth() + 1
    month = month > 10 ? month : '0' + month
    let day = nowDate.getDate()
    day = day > 10 ? day : '0' + day
    nowDate = year + '-' + month + '-' + day
    // 提取数据
    let article = []
    article[0] = req.body.topic
    article[1] = req.body['editor-markdown-doc']
    article[2] = nowDate
    // 提交操作
    operation.newArticle(article, req.body.classify, req.body.tag)
    res.redirect('/')
})

// 公开指定目录
router.use('/css/', express.static('./css/'))
router.use('/node_modules/', express.static('./node_modules/'))

module.exports = router