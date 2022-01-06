/**
 * 封装app层, 项目启动入口
 */

const Koa = require('koa')
const KoaBody = require('koa-body')
const router = require('./router')


const app = new Koa()
app.use(KoaBody())
app.use(router.routes())

module.exports = app