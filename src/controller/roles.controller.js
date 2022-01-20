const log4js = require('../utils/log4j')
const { PARAM_ERROR, BUSINESS_ERROR } = require('../config/err.type')
const { find, findMany, updateById, add, deleteById } = require('../service/roles.service')
const util = require('../utils/util')
class RoleController {

    async createRole(ctx, next) {
        const { roleName, remark } = ctx.request.body
        // 参数校验
        if (!roleName) {
            return util.fail(PARAM_ERROR, ctx)
        }

        const params = { roleName, remark }
        let res = await add(params)
        if (res) {
            return util.success({ data: { affectedDocs: 1 } }, ctx)
        }

        return util.fail(BUSINESS_ERROR, ctx)

    }




    // 获取用户列表(需要分页)
    async roleList(ctx, next) {
        const { roleName, pageSize = 10, pageNum = 1 } = ctx.request.query

        //参数校验和处理
        let params = {}
        if (roleName) params.roleName = roleName;

        // 入参注释和校验请跳转查看工具类(pageSize和pageNum在get请求内类型为String)
        const pager = util.pager({ pageNum, pageSize })

        try {
            let res = await findMany(params, pager, { __v: 0 }, params.roleName ? true : false)
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

    // 获取全量角色列表(无需分页,排除部分不需要的字段)
    async roleAllList(ctx, next) {
        try {
            let res = await findMany({}, undefined, { _v: 0, remark: 0, permissionList: 0, createTime: 0, updateTime: 0 }, "precise")
            if (res) {
                const { list, total } = res
                return util.success({
                    data: {
                        list,
                    }
                }, ctx)
            }
        } catch (error) {
            log4js.info(error.stack)
        }

        return util.fail(BUSINESS_ERROR, ctx)
    }

    async deleteRole(ctx, next) {
        // 参数校验
        const { _id } = ctx.request.body
        if (!_id) return util.fail(PARAM_ERROR, ctx)

        try {
            let res = await deleteById(_id)
            if (res) return util.success({ data: { affectedDocs: 1 }, msg: `共删除1条` }, ctx)

        } catch (err) {
            log4js.info(err.stack)
        }
        return util.fail(BUSINESS_ERROR, ctx)

    }




    async updateRole(ctx, next) {
        const {
            _id,
            roleName, remark,
        } = ctx.request.body
        if (!_id) {
            return util.fail(PARAM_ERROR, ctx)
        }

        const params = { roleName, remark, }
        try {
            const res = await updateById(_id, params)
            if (res) return util.success({ data: { affectedDocs: 1 }, msg: `共更新1条` }, ctx)

        } catch (err) {
            log4js.info(err.stack)
        }
        return util.fail(BUSINESS_ERROR, ctx)
    }

    async updateRolePermission(ctx, next) {
        const {
            _id,
            permissionList,
        } = ctx.request.body
        if (!_id || !permissionList) {
            return util.fail(PARAM_ERROR, ctx)
        }

        const params = { permissionList, }
        try {
            const res = await updateById(_id, params)
            if (res) return util.success({ data: { affectedDocs: 1 }, msg: `共更新1条` }, ctx)

        } catch (err) {
            log4js.info(err.stack)
        }
        return util.fail(BUSINESS_ERROR, ctx)
    }

}


module.exports = new RoleController()