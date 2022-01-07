
const { koaSwagger } = require('koa2-swagger-ui')
const koaSwaggerUI = koaSwagger({
    routePrefix: '/api', // host at /swagger instead of default /docs
    swaggerOptions: {
        url: '/swagger.json', // example path to json swagger-jsdoc生成的文档地址
    },
})

module.exports = koaSwaggerUI

