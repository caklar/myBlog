const fs = require('fs')
const express = require('express')
var operation = require('./operation')

const router = express.Router()

// 跳转首页
router.get('/', function (req, res) {
    // 首页分页为 1
    operation.getArticlePage(1, function (message) {
        res.render('index.html', {
            article: message[0],
            totalPages : message[1],
            pageNum: 1
        })
    })
})

// 文章分页跳转
router.get('/article/page/:pageNum', function (req, res) {
    // 获取要跳转的分页号
    let pageNum = req.params.pageNum

    operation.getArticlePage(pageNum, function (message) {
        // console.log(message[1])
        res.render('index.html', {
            article: message[0],
            totalPages : message[1],
            pageNum: pageNum
        })
    })
})

// 跳转到文章页面
router.get('/article/:id', function (req, res) {
    // 获取文章 id
    let id = req.params.id

    operation.getOneArticle(id, function (message) {
        res.render('article.html', {
            topic: message[0][0].article_topic,
            content: message[0][0].article_content,
            date: message[0][0].article_date,
            className: message[0][0].class_name,
            class_id: message[0][0].class_id,
            tags: message[1],
        });
    })
})

// 跳转分类页面
router.get('/classify', function (req, res) {
    operation.getClass(1, function (message) {
        res.render(`classify.html`, {
            class_info: message
        })
    })
})

// 跳转分类文章界面
router.get('/classify/:id', function (req, res) {
    // 获取分类 id
    let id = req.params.id

    operation.getArticleC(id, 1, function (message) {
        res.render(`archive.html`, {
            type: 'article_c',
            mes: message[0],
            belong: message[1][0],
            totalPages: message[2],
            pageNum: 1,
            route: '/classify/' + id
        })
    })
})

// 分类文章分页
router.get('/classify/:id/page/:pageNum', function (req, res) {
    // 获取分类 id
    let id = req.params.id
    // 获取页码
    let pageNum = req.params.pageNum

    operation.getArticleC(id, pageNum, function (message) {
        res.render(`archive.html`, {
            type: 'article_c',
            mes: message[0],
            belong: message[1][0],
            totalPages: message[2],
            pageNum: pageNum,
            route: '/classify/' + id
        })
    })
})

// 跳转归档界面
router.get('/archive', function (req, res) {
    operation.getArchive(1, function (message) {
        res.render(`archive.html`, {
            type: 'archive',
            archive: message[0],
            year: message[1],
            totalPages : message[2],
            pageNum: 1,
            route: '/archive'
        })
    })
})

// 归档分页
router.get('/archive/page/:pageNum', function (req, res) {
    let pageNum = req.params.pageNum

    operation.getArchive(pageNum, function (message) {
        res.render(`archive.html`, {
            type: 'archive',
            archive: message[0],
            year: message[1],
            totalPages: message[2],
            pageNum: pageNum,
            route: '/archive'
        })
    })
})

// 跳转标签页面
router.get('/tag', function (req, res) {
    operation.getTag(function (message) {
        res.render(`tag.html`, {
            tag: message
        })
    })
})

// 跳转标签文章界面
router.get('/tag/:id', function (req, res) {
    // 获取标签 id
    let id = req.params.id

    operation.getArticleT(id, 1, function (message) {
        res.render(`archive.html`, {
            type: 'article_t',
            mes: message[0],
            belong: message[1][0],
            totalPages: message[2],
            pageNum: 1,
            route: '/tag/' + id
        })
    })
})

// 标签文章分页
router.get('/tag/:id/page/:pageNum', function (req, res) {
    // 获取标签 id
    let id = req.params.id
    // 获取页码
    let pageNum = req.params.pageNum

    operation.getArticleT(id, pageNum, function (message) {
        res.render(`archive.html`, {
            type: 'article_t',
            mes: message[0],
            belong: message[1][0],
            totalPages: message[2],
            pageNum: pageNum,
            route: '/tag/' + id
        })
    })
})

// 跳转关于页面
router.get('/about', function (req, res) {
    // 跳转到指定文章
    operation.getOneArticle(1, function (message) {
        res.render('article.html', {
            topic: message[0][0].article_topic,
            content: message[0][0].article_content,
            date: message[0][0].article_date,
            className: message[0][0].class_name,
            class_id: message[0][0].class_id,
            tags: message[1],
        });
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
    article[1] = req.body['editor-html-code']
    article[2] = nowDate
    // 提交操作
    operation.newArticle(article, req.body.classify, req.body.tag)
    res.redirect('/')
})

// 公开指定目录
router.use('/css/', express.static('./css/'))
router.use('/js/', express.static('./js/'))
router.use('/node_modules/', express.static('./node_modules/'))

module.exports = router