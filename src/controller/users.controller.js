const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const log4js = require('../utils/log4j')
const { SECRET_KEY } = require('../config/secret.key')
const { PARAM_ERROR, USER_ACCOUNT_ERROR, BUSINESS_ERROR } = require('../config/err.type')
const { findUser, findManyUsers, updateUsers, addUser } = require('../service/users.service')
const util = require('../utils/util')
class UserController {
    // 关于参数校验, 内部管理系统默认请求是相对比较安全的, 所以参数的校验相对简单一点
    // Todo, 关于参数校验,后面可以根据 model schema 来配合判断传入数据是否必须,类型是否正确
    //Todo: 增加密码修改功能


    async createUser(ctx, next) {
        // 管理系统一般是管理员来创建用户账户,本项目内普通用户无法创建账户
        // Todo: 控制创建用户的权限
        //Todo:参数校验:  密码一般要求字母大小写位数等等需要校验;手机号码一般要求格式需要校验 等等
        const {
            //userId 在 service层生成
            userName, userEmail,
            userPwd,
            mobile, job, state, roleList, deptId, sex, remark = ""
        } = ctx.request.body
        if (!userName || !userEmail || !userPwd || !deptId) {
            return util.fail(PARAM_ERROR, ctx)
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(userPwd, salt);
        const params = {
            userName, userEmail,
            userPwd: hash,
            mobile, job, state, roleList, deptId, sex, remark
        }
        let res = await addUser(params)
        if (res) {
            return util.success({ data: { affectedDocs: 1, /*userInfo:res*/ } }, ctx)
        }

        return util.fail(BUSINESS_ERROR, ctx)

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


    async deleteUsers(ctx, next) {
        // 参数校验
        const { userIds } = ctx.request.body
        if (!userIds || !Object.prototype.toString.call(userIds).includes('Array') || userIds.length <= 0) {
            return util.fail(PARAM_ERROR)
        }
        try {
            let res = await updateUsers(userIds, { state: 2 })
            if (res) return util.success({ data: { affectedDocs: res.modifiedCount }, msg: `共删除${res.modifiedCount}条` }, ctx)

        } catch (err) {
            log4js.info(error.stack)
        }
        return util.fail(BUSINESS_ERROR, ctx)

    }


    async updateUser(ctx, next) {
        const {
            userId, userName, userEmail, mobile, job, state, roleList, deptId, sex,
        } = ctx.request.body
        if (!userId || !userName || !userEmail || !deptId) {
            return util.fail(PARAM_ERROR)
        }

        const params = {
            // userId, userName, userEmail, //一旦创建以后则固定,一般不能修改
            mobile, job, state, roleList, deptId, sex
        }
        try {
            const res = await updateUsers([userId,], params)
            if (res) return util.success({ data: { affectedDocs: res.modifiedCount }, msg: `共更新${res.modifiedCount}条` }, ctx)

        } catch (err) {
            log4js.info(error.stack)
        }
        return util.fail(BUSINESS_ERROR, ctx)


    }

}


module.exports = new UserController()