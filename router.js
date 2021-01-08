const fs = require('fs')
const express = require('express')
const operation = require('./operation')
const sd = require('silly-datetime')
const { now } = require('jquery')

const router = express.Router()

// 文件上传插件
const multiparty = require('multiparty')

// 跳转首页
router.get('/', function (req, res) {
    // res.clearCookie('counter')
    // 获取客户端 ip 地址
    let ipStr = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || ''
    let ipReg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
    if (ipStr.split(',').length > 0) {
        ipStr = ipStr.split(',')[0]
    }
    let ip = ipReg.exec(ipStr)
    // 保存地址
    operation.IPAddress(ip[0])
    // 设置及获取 cookie 用以判断点击
    var now = new Date()
    now.setTime(now.getTime() + 24 * 60 * 60 * 1000)
    let visits = req.cookies.counter
    if (!visits) {
        visits = 1
        res.cookie('counter', visits, now)
        let nowData = sd.format(new Date(), 'YYYY-MM-DD')
        operation.clickCount(nowData)
    }
    // 首页分页为 1
    operation.getArticlePage(1, function (message1) {
        operation.getPersonal(function (message2) {
            res.render('index.html', {
                article: message1[0],
                totalPages : message1[1],
                pageNum: 1,
                mes: message2,
                route: '/article'
            })
        })
    })
})

// 文章分页跳转
router.get('/article/page/:pageNum', function (req, res) {
    // 获取要跳转的分页号
    let pageNum = req.params.pageNum

    operation.getArticlePage(pageNum, function (message1) {
        operation.getPersonal(function (message2) {
            res.render('index.html', {
                article: message1[0],
                totalPages : message1[1],
                pageNum: pageNum,
                mes: message2,
                route: '/article'
            })
        })
    })
})

// 跳转到文章页面
router.get('/article/:id', function (req, res) {
    // 获取文章 id
    let id = req.params.id
    operation.articleClick(id)

    operation.getOneArticle(id, function (message) {
        res.render('article.html', {
            topic: message[0][0].article_topic,
            content: message[0][0].article_content,
            date: message[0][0].article_date,
            className: message[0][0].class_name,
            class_id: message[0][0].class_id,
            tags: message[1],
            revise: message[0][0].revise_date
        });
    })
})

// 跳转分类页面
router.get('/classify', function (req, res) {
    operation.getClass(function (message) {
        res.render(`classify.html`, {
            class_info: message[0],
            count: message[1][0].count
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
            count: message[3],
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
            count: message[3],
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
            count: message[3],
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
            count: message[3],
            route: '/archive'
        })
    })
})

// 跳转标签页面
router.get('/tag', function (req, res) {
    operation.getTag(function (message) {
        res.render(`tag.html`, {
            tag: message[0],
            count: message[1][0].count,
            size: message[2]
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
            count: message[3],
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
            count: message[3],
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

// 新建文章界面
router.get('/newArticle', function (req, res) {
    fs.readFile('./views/newArticle.html', 'utf8', function (err, data) {
        if (err) {
            return res.status(500).send('error')
        } else {
            res.end(data)
        }
    })
})

// 后台管理界面
router.get('/manage', function (req, res) {
    fs.readFile('./views/manage.html', 'utf8', function (err, data) {
        if (err) {
            return res.status(500).send('error')
        } else {
            res.end(data)
        }
    })
})

// 文章操作界面
router.get('/articleOps', function (req, res) {
    operation.getArticleOps(1, function (message) {
        res.render('articleOps.html', {
            articleMes: message[0],
            totalPages: message[1],
            tagMes: message[2],
            pageNum: 1,
            route: '/articleOps'
        })
    })
})

// 文章操作界面分页
router.get('/articleOps/page/:pageNum', function (req, res) {
    let pageNum = req.params.pageNum

    operation.getArticleOps(pageNum, function (message) {
        res.render('articleOps.html', {
            articleMes: message[0],
            totalPages: message[1],
            tagMes: message[2],
            pageNum: pageNum,
            route: '/articleOps'
        })
    })
})

// 文章修改界面
router.get('/articleRevise/article/:id', function (req,res) {
    let id = req.params.id
    
    operation.getOneArticle(id, function (message) {
        // 将数组中对象的属性转化为字符串
        let tag = ''
        message[1].forEach(function (item) {
            tag += item.tag_name + ','
        })
        tag = tag.slice(0, -1)

        res.render('articleRevise.html', {
            article: message[0][0],
            tag: tag
        })
    })
})

// 文章修改
router.post('/articleRevise', function (req, res) {
    let nowDate = sd.format(new Date(), 'YYYY-MM-DD')

    let article = []
    article[0] = req.body.id
    article[1] = req.body.topic
    article[2] = req.body.content
    article[3] = req.body.contentmd
    article[4] = nowDate

    let tag = req.body.tag.split(',')
    
    operation.articleRevise(article, req.body.classify, tag)
    res.redirect('/articleOps')
})

// 文章回收
router.post('/articleThrow', function (req, res) {
    let id = req.body.id

    operation.articleThrow(id)
    res.redirect('/articleOps')
})

// 个人信息界面
router.get('/personal', function (req, res) {
    operation.getPersonal(function (message) {
        res.render('personal.html', {
            mes: message
        })
    })
})

// 个人信息修改
router.post('/revisePersonal', function (req, res) {
    // 判断是否选择文件
    if (JSON.stringify(req.body) != '{}') {
        let mes = []
        mes[0] = req.body.name
        mes[1] = req.body.intro
        mes[2] = req.body.link1
        mes[3] = req.body.link2
        mes[4] = req.body.link3
        mes[5] = req.body.image

        operation.revisePersonal(mes)
    } else {
        // 文件保存
        // 生成 multiparty 对象，并配置上传目标路径
        let form = new multiparty.Form({
            encoding: 'utf-8',      // 设置编码
            uploadDir: './image'    // 设置文件保存根目录
        })

        form.parse(req, function (err, fields, files) {
            // 文件获取
            let inputFile = files.image[0]
            // 设置文件储存路径
            let newPath = form.uploadDir + '/' + inputFile.originalFilename;
            // 重命名文件名
            fs.renameSync(inputFile.path, newPath)
            // 数据处理
            let mes = []
            mes[0] = fields.name[0]
            mes[1] = fields.intro[0]
            mes[2] = fields.link1[0]
            mes[3] = fields.link2[0]
            mes[4] = fields.link3[0]
            mes[5] = inputFile.originalFilename

            operation.revisePersonal(mes)
        })
    }
    // 响应信息
    res.end('success')
})

// 回收站页面
router.get('/recycle', function (req, res) {
    operation.getRecycle(1, function (message) {
        res.render('recycle.html', {
            articleMes: message[0],
            totalPages: message[1],
            tagMes: message[2],
            pageNum: 1,
            route: '/recycle'
        })
    })
})

// 回收站页面分页
router.get('/recycle/page/:pageNum', function (req, res) {
    let pageNum = req.params.pageNum

    operation.getRecycle(pageNum, function (message) {
        res.render('recycle.html', {
            articleMes: message[0],
            totalPages: message[1],
            tagMes: message[2],
            pageNum: pageNum,
            route: '/recycle'
        })
    })
})

// 回收站文章恢复
router.post('/articleRecover', function (req, res) {
    let id = req.body.id

    operation.articleRecover(id)
    res.redirect('/recycle')
})

// 回收站文章删除
router.post('/articleDelete', function (req, res) {
    let id = req.body.id

    operation.articleDelete(id)
    res.redirect('/recycle')
})

// 新建文章提交
router.post('/newArticle', function (req, res) {
    // 获取并格式化当前时间
    let nowDate = sd.format(new Date(), 'YYYY-MM-DD')
    // 提取数据
    let article = []
    article[0] = req.body.topic
    article[1] = req.body.content
    article[2] = nowDate
    article[3] = req.body.contentmd
    // 处理多个标签
    let tag = req.body.tag.split(',')
    // 提交操作
    operation.newArticle(article, req.body.classify, tag)
    res.redirect('/')
})

// 文章查询
router.get('/articleSearch/:str', function (req, res) {
    let str = req.params.str
    
    operation.articleSearch(str, function (message) {
        res.render('articleSearch.html', {
            count: message[1][0].count,
            article: message[0]
        })
    })
})

// 数据统计界面
router.get('/statistics', function(req, res) {
    operation.getVisitors(function (message1) {
        operation.totalCount(function (message2) {
            operation.weeklyCount(function (message3) {
                operation.articleSort(function (message4) {
                    // 数据处理
                    let date = [], count = []
                    message3.forEach(function (item, index) {
                        date[index] = item.date.split('-')[2]
                        count[index] = item.count
                    })
                    res.render('statistics.html', {
                        totalCount: message2[0].sum,
                        visitorCount: message1[0].count,
                        weeklyDate: date.reverse(),
                        weeklyCount: count.reverse(),
                        articleSort: message4
                    })
                })
            })
        })
    })
})

// 登录页面 
router.get('/login', function (req, res) {
    fs.readFile('./views/login.html', 'utf8', function (err, data) {
        if (err) {
            return res.status(500).send('error')
        } else {
            res.end(data)
        }
    })
})

// 用户登录
router.post('/userlogin', function (req, res) {
    operation.userLogin(req.body.username, req.body.password, function(mes) {
        if (mes.length == 0) {
            res.end('0')
        } else {
            res.end('1')
        }
    })
})

// 公开指定目录
router.use('/css/', express.static('./css/'))
router.use('/js/', express.static('./js/'))
router.use('/node_modules/', express.static('./node_modules/'))
router.use('/icon/', express.static('./icon/'))
router.use('/image/', express.static('./image'))

module.exports = router