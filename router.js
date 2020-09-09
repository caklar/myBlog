const fs = require('fs')
const express = require('express')

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

// 公开指定目录
router.use('/css/', express.static('./css/'))
router.use('/node_modules/', express.static('./node_modules/'))

module.exports = router