const { findUser } = require('../service/users.service')
const { PARAM_ERROR, USER_ACCOUNT_ERROR } = require('../config/err.type')
const { success, fail } = require('../utils/util')
class UserController {
    async register(ctx, next) {
        ctx.body = '用户注册成功'
    }


    async login(ctx, next) {
        const { userName, userPwd } = ctx.request.body
        if (!userName || !userPwd) {
            ctx.body = fail(PARAM_ERROR)
            return
        }
        let res = await findUser({ userName, userPwd })
        if (res) {
            ctx.body = success({ data: res })
        } else {
            ctx.body = fail(USER_ACCOUNT_ERROR)
        }
    }
}


module.exports = new UserController()