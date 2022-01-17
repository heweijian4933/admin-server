const log4js = require('../utils/log4j')
const { PARAM_ERROR, BUSINESS_ERROR } = require('../config/err.type')
const { find, findMany, update, add } = require('../service/menus.service')
const util = require('../utils/util')
class MenuController {

    async createMenu(ctx, next) {
        const { component, icon, menuName, menuState, menuType, parentId, path, } = ctx.request.body
        // 参数校验
        if (!menuName || (menuType == 1 && !path)) {
            return util.fail(PARAM_ERROR, ctx)
        }

        const params = { component, icon, menuName, menuState, menuType, parentId, path, }
        let res = await add(params)
        if (res) {
            return util.success({ data: { affectedDocs: 1, menu: res } }, ctx)
        }

        return util.fail(BUSINESS_ERROR, ctx)

    }




    // 获取菜单列表
    async menuList(ctx, next) {
        let { menuName, menuState } = ctx.request.query

        //参数校验和处理
        const params = {}
        if (menuName) params.menuName = menuName
        menuState = menuState * 1;//将query的字符串数字转换成Number类型
        if (isNaN(menuState)) {
            //如果menuState转换后是NaN,说明入参格式不对;字符串数字转换为Number类型以后不会是NaN
            return util.fail(PARAM_ERROR, ctx)
        } else if (menuState) {
            // 如果menuState 符合| 1：正常 2：停用 [提示]这里其实写法还可以更加严谨一点
            params.menuState = menuState
        } else {
            // 如果menuState 符合 0:所有
            // do nothing, 也就是params没有menuState字段
        };


        try {
            let res = await findMany(params, { __v: 0 }, "fuzzy") //具体见findManyMenus参数要求
            if (res) {
                return util.success({ data: res }, ctx)
            }
        } catch (error) {
            log4js.info(error.stack)
        }

        return util.fail(BUSINESS_ERROR, ctx)
    }


    async deleteMenu(ctx, next) {
        // 参数校验
        const { userIds } = ctx.request.body
        if (!userIds || !Object.prototype.toString.call(userIds).includes('Array') || userIds.length <= 0) {
            return util.fail(PARAM_ERROR, ctx)
        }
        try {
            let res = await update(userIds, { state: 2 })
            if (res) return util.success({ data: { affectedDocs: res.modifiedCount }, msg: `共删除${res.modifiedCount}条` }, ctx)

        } catch (err) {
            log4js.info(error.stack)
        }
        return util.fail(BUSINESS_ERROR, ctx)

    }


    async updateMenu(ctx, next) {
        const {
            _id,
            children, component, icon, menuName, menuState, menuType, parentId, path,
        } = ctx.request.body
        if (!_id || (menuType == 1 && !path)) {
            return util.fail(PARAM_ERROR, ctx)
        }

        const params = { children, component, icon, menuName, menuState, menuType, parentId, path, }
        // try {
        const res = await update(_id, params)
        if (res) return util.success({ data: { affectedDocs: res.modifiedCount }, msg: `共更新${res.modifiedCount}条` }, ctx)

        // } catch (err) {
        //     log4js.info(err.stack)
        // }
        return util.fail(BUSINESS_ERROR, ctx)


    }

}


module.exports = new MenuController()