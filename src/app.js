/**
 * 封装app层, 项目启动入口
 */

const Koa = require('koa')
const KoaBody = require('koa-body')
const router = require('./router')

const log4js = require('./utils/log4j')

const swagger = require('./api/swagger.config.js')
const swaggerUI = require('./api/swagger.UI.js')

require('./db')

const app = new Koa()
app.use(KoaBody())
app.use(swaggerUI)  //引入swagger ui

app.use(swagger.routes())  //引入swagger router
app.use(router.routes()).use(router.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
    log4js.error(`
    ${JSON.stringify(ctx.request.body)}
    ${JSON.stringify(ctx.request)}
    ${err.stack}
    `)
});


module.exports = app