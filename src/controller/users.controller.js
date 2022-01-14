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
        const { userName, userPwd } = ctx.request.body
        if (!userName || !userPwd) {
            return util.fail(PARAM_ERROR, ctx)
        }
        try {
            let userInfo = await findUser({ userName }, { userPwd: 1, })
            //详情见findUser, { userName }为关键入参, 用于筛选对应字段
            //{userPwd: 1 },表示返回userPwd字段=>用于以下业务判断
            if (userInfo) {
                console.log(userInfo);
                let userPwdCompare = await bcrypt.compare(userPwd, userInfo.userPwd)
                if (userPwdCompare) {
                    delete userInfo.userPwd
                    //[重要]:将加密后的密码从返回值内删除,避免暴露到前端
                    let token = jwt.sign({ userInfo }, SECRET_KEY, { expiresIn: '1h' })
                    delete userInfo._id
                    return util.success({ data: { ...userInfo, token } }, ctx)
                }
            }
        } catch (error) {
            log4js.info(error.stack)
        }

        return util.fail(USER_ACCOUNT_ERROR, ctx)
    }

    // 获取用户列表
    async userList(ctx, next) {
        let {
            userId,
            userName,
            state, 			// 0:所有 | 1：在职 2：离职 3：试用期
            pageNum = 1, 	// 当前页码
            pageSize = 10   // 每页条数，默认10
        } = ctx.request.query

        //参数校验和处理
        let params = {}
        if (userId) params.userId = userId;
        if (userName) params.userName = userName;
        state = state * 1;//将query的字符串数字转换成Number类型
        if (isNaN(state)) {
            //如果state转换后是NaN,说明入参格式不对;字符串数字转换为Number类型以后不会是NaN
            return util.fail(PARAM_ERROR)
        } else if (state) {
            // 如果state 符合| 1：在职 2：离职 3：试用期; [提示]这里其实写法还可以更加严谨一点
            params.state = state
        } else {
            // 如果state 符合 0:所有
            // do nothing, 也就是params没有state字段
        };

        // 入参注释和校验请跳转查看工具类
        const pager = util.pager({ pageNum, pageSize })

        try {
            let res = await findManyUsers(params, pager, undefined, "fuzzy")
            if (res) {
                const { list, total } = res
                return util.success({
                    data: {
                        page: {
                            ...pager.page, total: total,
                        },
                        list: list
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