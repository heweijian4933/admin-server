const Role = require('../db/roles.schema')
const log4js = require('../utils/log4j')
const util = require('../utils/util')
const ObjectId = require('mongoose').Types.ObjectId //mongoose的type对象, 用于新增_id
// 获取全局userSchema字段
const schemaKeys = Object.keys(Role.schema.tree);
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
     * 添加角色
     * @param {Object} params
     * @param {String} params.roleName - 角色名称
     * @param {String} params.userName - 角色备注
     * @param {Array} params.permissionList - 角色权限列表
     */
    async add(params) {
        const _id = new ObjectId().toString()
        let res = await Role.create({ _id, ...params, createTime: new Date(), updateTime: null })
        if (res) return res.toObject()
        return false
    },

    /**
     * 查找单个角色
     * @param {Object} params - 查找的字段根据
     * @param {Object=} [projection={ __v: 0 }] - 返回结果中要排除的字段
     * @param {Number || Boolean} [projection.__v=0] - 返回结果中默认排除字段__v
     * @param {String} [mode="precise"] - 默认采用精确匹配模式 "precise":精确匹配检索; "fuzzy":模糊匹配检索
     */
    async find(params, projection = { __v: 0 }, searchMode = "precise") {
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
        let res = await Role.findOne(params, projection)
        if (res) return res.toObject()
        // 返回的res是一个mongoose Model对象,需要用附带的toObject方法处理成纯粹的对象格式
        return false

    },

    /**
     * 查找多个角色(分页 或者 不分页)
     * @param {Object} params - 查找的字段根据
     * @param {Object=} [projection={ __v: 0 }] - 返回结果中 要排除的字段
     * @param {String} [mode="precise"] - 默认采用精确匹配模式 "precise":精确匹配检索; "fuzzy":模糊匹配检索
     */
    async findMany(params, pager, projection = { __v: 0 }, searchMode = "precise") {
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
        let res, count;
        if (pager) { //如果需要分页
            const { page, skipIndex } = pager //默认值{ page:{ pageNum: 1, pageSize: 10 }, skipIndex:0 }见utils/util.pager
            const query = Role.find(params, projection)
            res = await query.skip(skipIndex).limit(page.pageSize)
            count = await Role.countDocuments()
            if (res) return { list: res, total: count }
        } else {//如果不需要分页
            res = await Role.find(params, projection)
            count = await Role.countDocuments()
            if (res) return { list: res, total: count }
        }

        return false

    },

    /**
     * 更新角色(单个)
     * @param {Array} _id - 角色 id
     * @param {Object} params  - 要更新的字段信息
     */
    async updateById(_id, params) {
        let res = await Role.findByIdAndUpdate(_id, { ...params, updateTime: new Date() })
        if (res) return res
        return false
    },

    /**
     * 删除角色(单个)
     * @param {Array} _id - 角色 id
     */
    async deleteById(_id) {
        let res = await Role.findByIdAndDelete(_id)
        if (res) return res
        return false
    },


}