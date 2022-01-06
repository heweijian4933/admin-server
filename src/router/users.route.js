const router = require('koa-router')({ prefix: '/users' })


router.get('/login', (ctx, next) => {
    ctx.body = 'login'
})

router.get('/register', (ctx, next) => {
    ctx.body = 'register'
})

module.exports = router