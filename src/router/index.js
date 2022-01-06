/**
 * 封装动态路由
 */

const router = require('koa-router')()
const fs = require('fs')

//动态加载当前目录当中的路由模块
fs.readdirSync(__dirname).forEach(fileName => {
    if (fileName !== 'index.js') {
        const r = require('./' + fileName)
        router.use(r.routes())
    }
})

module.exports = router