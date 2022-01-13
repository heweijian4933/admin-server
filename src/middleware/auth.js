/**
 * auth中间件, 用于解析token获取userInfo
 */
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../config/secret.key')
const util = require('../utils/util')
const { AUTH_ERROR } = require('../config/err.type')

const verifyToken = async (ctx, next) => {
    const { authorization } = ctx.request.header
    const token = authorization.replace(/^bearer /i, '')
    try {
        const {userInfo} = jwt.verify(token, SECRET_KEY)
        // 将token解析出的用户信息userInfo作为参数传递
        ctx.state.userInfo = userInfo
    } catch (err) {
        // TokenExpiredError或者JsonWebTokenError
        return util.fail(AUTH_ERROR, ctx)

    }

    await next()
}

module.exports = {
    verifyToken,
}