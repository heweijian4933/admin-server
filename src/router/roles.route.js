const { roleList, roleAllList, createRole, updateRole, updateRolePermission, deleteRole } = require('../controller/roles.controller')
const { verifyToken } = require('../middleware/auth')

const router = require('koa-router')({ prefix: '/roles' })

router.get('/list', verifyToken, roleList)
router.get('/allList', verifyToken, roleAllList)
router.post('/create', verifyToken, createRole)
router.post('/update', verifyToken, updateRole)
router.post('/updatePermission', verifyToken, updateRolePermission)
router.post('/delete', verifyToken, deleteRole)

module.exports = router