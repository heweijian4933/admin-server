const { deptList, deptTreeList, createDept, updateDept, deleteDept } = require('../controller/depts.controller')
const { verifyToken } = require('../middleware/auth')

const router = require('koa-router')({ prefix: '/depts' })

router.get('/list', verifyToken, deptList)
router.get('/treeList', verifyToken, deptTreeList)
router.post('/create', verifyToken, createDept)
router.post('/update', verifyToken, updateDept)
router.post('/delete', verifyToken, deleteDept)

module.exports = router