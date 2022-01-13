const router = require('koa-router')({ prefix: '/users' })
const { login, userList } = require('../controller/users.controller')
const { verifyToken } = require('../middleware/auth')

router.post('/login', login)

router.get('/register', (ctx, next) => {
    ctx.body = 'register'
})

router.get('/list', verifyToken, userList)

module.exports = router