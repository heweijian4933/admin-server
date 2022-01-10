const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/env')
const { PARAM_ERROR, USER_ACCOUNT_ERROR } = require('../config/err.type')
const { findUser } = require('../service/users.service')
const { success, fail } = require('../utils/util')
class UserController {
    // 关于参数校验, 内部管理系统默认请求是相对比较安全的, 所以参数的校验相对简单一点


    async register(ctx, next) {
        // Todo, 管理系统一般是管理员创建用户账户
        // 账户名和密码多事管理员创建的, 所以也没有XSS的安全问题
        const { userName, userPwd } = ctx.request.body
        if (!userName || !userPwd) {
            ctx.body = fail(PARAM_ERROR)
            return
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(userPwd, salt);
        //password.toString()通常可以不用,因为前端提交的密码一般是字符串
        // 如果userPwd是数字的话,bcrypt会报错

        ctx.request.body.password = hash
        ctx.body = '用户注册成功'
    }


    async login(ctx, next) {
        // 参数校验,因该校验部分无需复用, 所以就没有构建成middleware中间件
        // todo, 增强校验, 解决XSS的安全问题
        const { userName, userPwd } = ctx.request.body
        if (!userName || !userPwd) {
            ctx.body = fail(PARAM_ERROR)
            return
        }

        let res = await findUser({ userName })
        if (res) {
            let userPwdCompare = await bcrypt.compare(userPwd, res.userPwd)
            if (userPwdCompare) {
                let token = jwt.sign(res, SECRET_KEY, { expiresIn: '1h' })
                delete res.userPwd
                //[重要]:将加密后的密码从返回值内删除,避免暴露到前端
                ctx.body = success({ data: { ...res, token } })
                return
            }
        }
        return fail(USER_ACCOUNT_ERROR)
    }
}


module.exports = new UserController()