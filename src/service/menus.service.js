const Menu = require('../db/menus.schema')
const log4js = require('../utils/log4j')
const util = require('../utils/util')

// 获取全局userSchema字段
const schemaKeys = Object.keys(Menu.schema.tree);
/**
 * 处理传入字段
 * @param {object} projection 
 */
const handleProjection = (projection = {}) => {
    const match = {}
    schemaKeys.forEach(key => {
        if (projection[key] == undefined) {
            match[key] = 1
        } else if (projection[key]) {
            match[key] = 1
        } else {
            // 如果设定了_id = 0, 那么返回字段要排除_id(与其他字段不同, _id为mongodb默认字段, 默认自动生成和返回,如果要排除需要让_id=0)
            if (key === '_id') return match[key] = 0
            //如果设定了要排除的字段且该字段不是_id, 则从match当中去掉该键, 这样返回值就不带该键了
            delete match[key]
        }

    })
    return match
}

module.exports = {

    /**
     * 添加菜单
     * @param {Object} params - 查找的字段根据
     * @param {String} params.userId - 菜单ID ,字符串数字, 必须
     * @param {String} params.userName - 菜单姓名 必须
     * @param {String} params.userPwd - 菜单密码 必须
     * @param {String} params.userEmail - 菜单邮箱 必须
     * @param {Array} params.deptId - 菜单所在部门 ID 必须
     */
    async add(params) {
        let res = await Menu.create({ ...param, createTime: new Date(), updateTime: null })
        if (res) return res.toObject()
        return false
    },

    /**
     * 查找单个菜单
     * @param {Object} params - 查找的字段根据
     * @param {Object=} [projection={ userPwd: 0, _id: 0 }] - 返回结果中要排除的字段
     * @param {Number || Boolean} [projection.userPwd=0] - 返回结果中默认排除密码
     * @param {Number || Boolean} [projection._id=0] - 返回结果中默认排除字段id
     * @param {String} [mode="precise"] - 默认采用精确匹配模式 "precise":精确匹配检索; "fuzzy":模糊匹配检索
     */
    async find(params, projection = { userPwd: 0, _id: 0 }, searchMode = "precise") {
        // 默认projection = { userPwd: 0 }, 表示默认不返回菜单密码字段
        projection = handleProjection(projection)
        if (searchMode === "fuzzy") {
            for (key in params) {
                let value = params[key]
                if (Object.prototype.toString.call(value).includes('String') || key === 'userId') {
                    // 如果该类型是字符串或者是userId才进行模糊检索
                    let reg = new RegExp(value, 'i')
                    value = reg
                }
            }
        }
        let res = await Menu.findOne(params, projection)

        console.log(res);
        if (res) return res.toObject()
        // 返回的res是一个mongoose Model对象,需要用附带的toObject方法处理成纯粹的对象格式
        // [警告]:如果res带菜单密码,在controller层需要做处理,禁止暴露到前端
        return false

    },

    /**
     * 查找多个菜单(无需分页)
     * @param {Object} params - 查找的字段根据
     * @param {Object=} [projection={ __v: 0 }] - 返回结果中 要排除的字段
     * @param {String} [mode="precise"] - 默认采用精确匹配模式 "precise":精确匹配检索; "fuzzy":模糊匹配检索
     */
    async findMany(params, projection = { __v: 0 }, searchMode = "precise") {
        projection = handleProjection(projection)
        if (searchMode === "fuzzy") {
            for (key in params) {
                let value = params[key]
                if (Object.prototype.toString.call(value).includes('String')) {
                    // 如果该类型是字符串才进行模糊检索
                    let reg = new RegExp(value, 'i')
                    params[key] = reg
                }
            }
        }
        const res = await Menu.find(params, projection)
        console.log(res);
        if (res) return res
        return false

    },

    /**
     * 更新菜单(单个)
     * @param {Array} _id - 菜单 id
     * @param {Object} params  - 要更新的字段信息
     */
    async update(_id, params) {
        let res = await Menu.findOneAndUpdate({ _id, }, { ...params, updateTime: new Date() })
        console.log("res=>", res);
        if (res && res.acknowledged) return res
        return false
    },




}