/**
 * 通用工具函数
 */
const log4js = require('./log4j.js')
const { BUSINESS_ERROR } = require('../config/err.type')

module.exports = {
    success({ data = {}, msg = 'OK', code = 200 }) {
        log4js.debug(data);
        return {
            code, data, msg
        }
    },
    fail({ msg = BUSINESS_ERROR.msg, code = BUSINESS_ERROR.code, data = {} }) {
        log4js.debug(msg);
        return {
            code, data, msg
        }
    },

    formateDate(date, rule) {
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
    },
}