const { userFind } = require('../service/users.service')
const { PARAM_ERROR } = require('../config/err.type')
const { success, fail } = require('../utils/util')
class UserController {
    async register(ctx, next) {
        ctx.body = '用户注册成功'
    }


    async login(ctx, next) {
        const { username, password } = ctx.request.body
        if (!username || !password) {
            ctx.body = fail({ ...PARAM_ERROR })
            return
        }
        let res = await userFind({ username, password })
        console.log(res);
        if (res) {
            ctx.body = success({ data: res })
        }
    }
}


module.exports = new UserController()