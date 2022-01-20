const { login, userList, userAllList, createUser, updateUser, deleteUsers } = require('../controller/users.controller')
const { verifyToken } = require('../middleware/auth')

const router = require('koa-router')({ prefix: '/users' })

router.post('/login', login)

router.get('/list', verifyToken, userList)
router.get('/allList', verifyToken, userAllList)
router.post('/create', verifyToken, createUser)
router.post('/update', verifyToken, updateUser)
router.post('/delete', verifyToken, deleteUsers)

module.exports = router