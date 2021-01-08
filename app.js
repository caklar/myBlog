const express = require('express')
const path = require('path')
const router = require('./router')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

const app = express()

// 处理 post 请求
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

// 处理 cookie
app.use(cookieParser());

// 使用 art-template 模板引擎
app.engine('html', require('express-art-template'));
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});

app.use(router)

app.listen(3000, function (){
    console.log('running......')
})