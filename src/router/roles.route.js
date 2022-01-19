const { roleList, roleAllList, createRole, updateRole, deleteRole } = require('../controller/roles.controller')
const { verifyToken } = require('../middleware/auth')

const router = require('koa-router')({ prefix: '/menus' })

router.get('/list', verifyToken, roleList)
router.get('/allList', verifyToken, roleAllList)
router.post('/create', verifyToken, createRole)
router.post('/update', verifyToken, updateRole)
router.post('/delete', verifyToken, deleteRole)

module.exports = router