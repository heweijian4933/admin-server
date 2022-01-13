const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const log4js = require('../utils/log4j')
const { SECRET_KEY } = require('../config/secret.key')
const { PARAM_ERROR, USER_ACCOUNT_ERROR, BUSINESS_ERROR } = require('../config/err.type')
const { findUser, findManyUsers } = require('../service/users.service')
const util = require('../utils/util')
class UserController {
    // 关于参数校验, 内部管理系统默认请求是相对比较安全的, 所以参数的校验相对简单一点


    async register(ctx, next) {
        // Todo, 管理系统一般是管理员创建用户账户
        // 账户名和密码多事管理员创建的, 所以也没有XSS的安全问题
        const { userName, userPwd } = ctx.request.body
        if (!userName || !userPwd) {
            returnutil.fail(PARAM_ERROR, ctx)

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
            return util.fail(PARAM_ERROR, ctx)
        }
        try {
            let userInfo = await findUser({ userName }, { userPwd: 1 })
            //详情见findUser, { userName }为关键入参, 用于筛选对应字段
            //{userPwd: 1 },表示返回userPwd字段=>用于以下业务判断
            if (userInfo) {
                console.log(userInfo);
                let userPwdCompare = await bcrypt.compare(userPwd, userInfo.userPwd)
                if (userPwdCompare) {
                    let token = jwt.sign({ userInfo }, SECRET_KEY, { expiresIn: '1h' })
                    delete userInfo.userPwd
                    //[重要]:将加密后的密码从返回值内删除,避免暴露到前端
                    return util.success({ data: { ...userInfo, token } }, ctx)
                }
            }
        } catch (error) {
            log4js.info(error.stack)
        }

        return util.fail(USER_ACCOUNT_ERROR, ctx)
    }

    async userList(ctx, next) {
        const {
            userId,
            userName,
            state, 			// 0:所有 1：在职 2：离职 3：试用期
            pageNum = 1, 	// 当前页码
            pageSize = 10   // 每页条数，默认10
        } = ctx.request.query

        const pager = util.pager(ctx.request.query)
        let params = {}

        if (userId) params.userId = userId;
        if (userName) params.userName = userName;
        if (state && state !== 0) params.state = state;
        try {
            let res = await findManyUsers(params, pager)
            if (res) {
                return util.success({
                    data: {
                        page: {
                            pageNum, pageSize, total: 10
                        },
                        list: res
                    }
                }, ctx)
            }
        } catch (error) {
            log4js.info(error.stack)
        }

        return util.fail(BUSINESS_ERROR, ctx)
    }
}


module.exports = new UserController()