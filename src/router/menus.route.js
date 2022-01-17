const { menuList, createMenu, updateMenu, deleteMenu } = require('../controller/menus.controller')
const { verifyToken } = require('../middleware/auth')

const router = require('koa-router')({ prefix: '/menus' })

router.get('/list', verifyToken, menuList)
router.post('/create', verifyToken, createMenu)
router.post('/update', verifyToken, updateMenu)
router.post('/delete', verifyToken, deleteMenu)

module.exports = router