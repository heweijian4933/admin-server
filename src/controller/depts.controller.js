const log4js = require('../utils/log4j')
const { PARAM_ERROR, BUSINESS_ERROR } = require('../config/err.type')
const { find, findMany, updateById, add, deleteById } = require('../service/depts.service')
const util = require('../utils/util')
class DeptController {

    async createDept(ctx, next) {
        const { deptName, parentId, userId } = ctx.request.body
        // 参数校验
        if (!deptName) {
            return util.fail(PARAM_ERROR, ctx)
        }

        const params = { deptName, parentId, userId }
        let res = await add(params)
        if (res) {
            return util.success({ data: { affectedDocs: 1 } }, ctx)
        }

        return util.fail(BUSINESS_ERROR, ctx)

    }




    // 获取用户列表(需要分页)
    async deptList(ctx, next) {
        const { deptName, pageSize = 10, pageNum = 1 } = ctx.request.query

        //参数校验和处理
        let params = {}
        if (deptName) params.deptName = deptName;

        // 入参注释和校验请跳转查看工具类(pageSize和pageNum在get请求内类型为String)
        const pager = util.pager({ pageNum, pageSize })

        try {
            let res = await findMany(params, pager, { __v: 0 }, params.deptName ? 'fuzzy' : 'precise')
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

    /* // 获取全量部门列表(无需分页,排除部分不需要的字段)
    async deptAllList(ctx, next) {
        try {
            let res = await findMany({}, undefined, { _v: 0, }, "precise")
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
    } */

    // 获取部门树形列表(无需分页)
    async deptTreeList(ctx, next) {
        const { deptName } = ctx.request.query

        //参数校验和处理
        let params = {}
        if (deptName) params.deptName = deptName;

        try {
            let res = await findMany(params, undefined, { _v: 0, }, params.deptName ? 'fuzzy' : 'precise', true)
            if (res) {
                console.log("成功返回res");
                let { list, total } = res
                console.log("list=>", list);
                if (list && list.length > 0) list = util.getTreeDept(list.slice(), null, [])
                console.log("treeList=>", list);
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

    async deleteDept(ctx, next) {
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


    async updateDept(ctx, next) {
        const {
            _id,
            deptName, userId, parentId
        } = ctx.request.body
        if (!_id) {
            return util.fail(PARAM_ERROR, ctx)
        }

        const params = { deptName, userId, parentId }
        try {
            const res = await updateById(_id, params)
            if (res) return util.success({ data: { affectedDocs: 1 }, msg: `共更新1条` }, ctx)

        } catch (err) {
            log4js.info(err.stack)
        }
        return util.fail(BUSINESS_ERROR, ctx)
    }



}


module.exports = new DeptController()