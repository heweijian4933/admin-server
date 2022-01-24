const log4js = require('../utils/log4j')
const { PARAM_ERROR, BUSINESS_ERROR, AUTH_ERROR } = require('../config/err.type')
const { find, findMany, updateById, add, deleteById } = require('../service/menus.service')
const { findMany: findManyRoles } = require('../service/roles.service')
const util = require('../utils/util')
class MenuController {

    async createMenu(ctx, next) {
        const { component, icon, menuName, menuState, menuCode, menuType, parentId, path, } = ctx.request.body
        // 参数校验
        if (!menuName || (menuType == 1 && !path)) {
            return util.fail(PARAM_ERROR, ctx)
        }

        const params = { component, icon, menuName, menuState, menuCode, menuType, parentId, path, }
        let res = await add(params)
        if (res) {
            return util.success({ data: { affectedDocs: 1, menu: res } }, ctx)
        }

        return util.fail(BUSINESS_ERROR, ctx)

    }




    // 获取菜单列表 - 树形结构
    async menuTreeList(ctx, next) {
        //menuState = 1必不可少, 在前端获取菜单侧边栏的时候此时没有入参, 但是我们默认只获取状态正常的菜单,所以默认menuState = 1
        let { menuName, menuState = 1 } = ctx.request.query
        //参数校验和处理
        let params = {}
        let recursion = true; //默认开启关联查询, 只要是该menu._id相关父级和子级等一系列menus都会被查找出来
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
            const { userInfo } = ctx.state
            if (!userInfo) return util.fail(AUTH_ERROR, ctx)
            const { role } = userInfo
            if (role === 1) {
                //普通用户, 根据角色 权限 来查找菜单
                const { roleList: roleIds } = userInfo
                let { list: roleList } = await findManyRoles({ _id: { $in: roleIds } }, undefined, { __v: 0 }, 'precise')
                let menuPermissionList = []
                roleList.forEach(role => {
                    let { checkedKeys, halfCheckedKeys } = role.permissionList
                    // checkedKeys{Array}, halfCheckedKeys{Array} 里面均是菜单menu的_id
                    menuPermissionList = menuPermissionList.concat([...checkedKeys, ...halfCheckedKeys])
                });
                // 一个用户可能对应多个角色, 而一个角色可能对应多个(菜单)权限, 因此一个用户多个权限当中可能会有重复的部门
                // 因此这里需要对(菜单)权限进行去重
                menuPermissionList = [...new Set(menuPermissionList)]
                params = { ...params, _id: { $in: menuPermissionList } }
                recursion = false //将关联查询设置为false, 避免出现越出权限的菜单
            } else if (role === 0) {
                //系统管理员, 获取全部菜单
                //do nothing 
            } else {
                return util.fail(AUTH_ERROR, ctx)
            }

            let res = await findMany(params, { __v: 0 }, params.menuName ? "fuzzy" : "precise", recursion) //具体见findManyMenus参数要求
            // console.log(res);
            if (res) {
                let menuList = util.getTreeMenu(res, null, [])
                let actionList = res.filter(menu => menu.menuType === 2 && menu.menuCode).map(menu => menu.menuCode)
                return util.success({ data: { menuList, actionList } }, ctx)
            }
        } catch (error) {
            log4js.info(error.stack)
        }

        return util.fail(BUSINESS_ERROR, ctx)
    }


    async deleteMenu(ctx, next) {
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




    async updateMenu(ctx, next) {
        const {
            _id,
            children, component, icon, menuName, menuState, menuCode, menuType, parentId, path,
        } = ctx.request.body
        if (!_id || (menuType == 1 && !path)) {
            return util.fail(PARAM_ERROR, ctx)
        }

        const params = { children, component, icon, menuName, menuState, menuCode, menuType, parentId, path, }
        try {
            const res = await updateById(_id, params)
            if (res) return util.success({ data: { affectedDocs: 1 }, msg: `共更新1条` }, ctx)

        } catch (err) {
            log4js.info(err.stack)
        }
        return util.fail(BUSINESS_ERROR, ctx)


    }

}


module.exports = new MenuController()