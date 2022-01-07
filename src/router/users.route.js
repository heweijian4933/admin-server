const router = require('koa-router')({ prefix: '/users' })
require('../api/users.api.js')


router.post('/login', (ctx, next) => {

    ctx.body = 'login'
    ctx.body =ctx.request.body
    // ctx.body = test
})

router.get('/register', (ctx, next) => {
    ctx.body = 'register'
})

module.exports = router