const express = require('express')
const router = require('./router')
const mysql = require('mysql')

const app = express()

app.use(router)

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123698745',
    database: 'blog'    
})

db.connect(function(err) {
    if (err) throw err;
    console.log('连接成功')
})

app.listen(3000, function (){
    console.log('running......')
})