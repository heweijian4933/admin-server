'use strict'
/**
 * 通用工具函数
 */
const log4js = require('./log4j.js')
const { BUSINESS_ERROR } = require('../config/err.type')

function success({ data = {}, msg = 'OK', code = 200 }, ctx) {
    const { method, url } = ctx.request
    let params;
    if (method.toLowerCase() == "get") {
        params = ctx.request.query
    } else {
        params = ctx.request.body
    }
    log4js.debug(`******************Request******************
    =>${method}  ${url}
    =>params - ${JSON.stringify(params)}
    =>Response - SUCCESS
    =>data - ${JSON.stringify(data).substr(0, 600)} ...
    `);
    ctx.body = {
        code, data, msg
    }

}
function fail({ msg = BUSINESS_ERROR.msg, code = BUSINESS_ERROR.code, data = {} }, ctx) {
    const { method, url } = ctx.request
    let params;
    if (method.toLowerCase() == "get") {
        params = ctx.request.query
    } else {
        params = ctx.request.body
    }
    log4js.debug(`******************Request******************
    =>${method}  ${url}
    =>params - ${JSON.stringify(params)}
    =>Response - FAIL
    =>message - ${msg} ...
    `);
    ctx.body = {
        code, data, msg
    }
    return
}

function formatDate(date, rule) {
    let fmt = rule || 'yyyy-MM-dd hh:mm:ss'
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, date.getFullYear())
    }
    const o = {
        // 'y+': date.getFullYear(),
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            const val = o[k] + '';
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? val : ('00' + val).substr(val.length));
        }
    }
    return fmt;
}

/**
 * 分页结构封装
 * @param {Object} params 
 * @param {Number} pageNum - 分页页数
 * @param {Number} pageSize - 分页数据条数
 */
function pager({ pageNum = 1, pageSize = 10 }) {
    // 入参校验和处理
    try {
        pageNum = pageNum * 1
        if (isNaN(pageNum)) pageNum = 1

        pageSize = pageSize * 1
        if (isNaN(pageSize)) pageSize = 10
    } catch (error) {
        log4js.info(error.stack)
    }

    const skipIndex = (pageNum - 1) * pageSize
    return {
        page: {
            pageNum,
            pageSize,
        },
        skipIndex,
    }
}

/**
 * 递归拼装树形结构菜单
 * @param {Array} rootList 
 * @param {String} [id=null] 
 * @param {Array} list 
 */
function getTreeMenu(rootList, id = null, list = []) {
    for (let item of rootList) {
        if (item.parentId.slice().pop() == id) {
            list.push(item._doc || item)
        }
    }
    list.forEach(item => {
        item.children = []
        getTreeMenu(rootList, item._id, item.children)
        if (item.children.length <= 0) {
            delete item.children;
        } else if (item.children[0] && item.children[0].menuType == 2) {
            // 增加action 用于后续 快速判断是菜单还是按钮
            item.action = item.children
        }
    })
    return list
}

/**
 * 递归拼装树形结构部门列表
 * @param {Array} rootList 
 * @param {String} [id=null] 
 * @param {Array} list 
 */
function getTreeDept(rootList, id = null, list = []) {
    for (let item of rootList) {
        if (item.parentId.slice().pop() == id) {
            list.push(item._doc || item)
        }
    }
    list.forEach(item => {
        item.children = []
        getTreeDept(rootList, item._id, item.children)
        // if (item.children.length <= 0) {
        //             //     delete item.children;
        // }
    })
    return list
}

module.exports = {
    success,
    fail,
    pager,
    formatDate,
    getTreeMenu,
    getTreeDept,
}