const path = require("path")
const router = require('koa-router')() //引入路由函数
const swaggerJSDoc = require('swagger-jsdoc')
const { APP_PORT } = require('../config')

const swaggerDefinition = {
    schemes: ['http', 'https'],
    info: {
        title: 'admin-server API',
        version: '1.0.0',
        description: '内部管理项目用API',
        contact: {
        },

    },
    host: `localhost:${APP_PORT}`,
    basePath: '/', // Base path (optional)
    securityDefinitions: {
        // server_auth: {
        //     type: 'oauth2',
        //     description: '登录账号密码鉴权',
        //     tokenUrl: 'http://localhost:4000/image/oauth',
        //     flow: 'password',
        //     scopes: {
        //         token: 'modify pets in your account'
        //     }
        // },//暂时不需要
        token: {
            type: 'apiKey',
            name: 'token',
            in: 'header'
        }
    }
};

const options = {
    swaggerDefinition,
    apis: ['./src/router/*.js', './src/api/*api.js',], // 写有注解的router的存放地址, ./从根目录开始索引
};


const swaggerSpec = swaggerJSDoc(options)

// 通过路由获取生成的注解文件
router.get('/swagger.json', async function (ctx) {
    ctx.set('Content-Type', 'application/json');
    ctx.body = swaggerSpec;
})

module.exports = router
//将页面暴露出去