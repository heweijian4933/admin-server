const router = require('koa-router')({ prefix: '/users' })
const { login } = require('../controller/users.controller')


router.post('/login', login)

router.get('/register', (ctx, next) => {
    ctx.body = 'register'
})

module.exports = router