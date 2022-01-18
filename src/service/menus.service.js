const Menu = require('../db/menus.schema')
const log4js = require('../utils/log4j')
const util = require('../utils/util')
const ObjectId = require('mongoose').Types.ObjectId //mongoose的type对象, 用于新增_id
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
        const _id = new ObjectId().toString()
        let res = await Menu.create({ _id, ...params, createTime: new Date(), updateTime: null })
        if (res) return res.toObject()
        return false
    },

    /**
     * 查找单个菜单
     * @param {Object} params - 查找的字段根据
     * @param {Object=} [projection={ __v: 0 }] - 返回结果中要排除的字段
     * @param {Number || Boolean} [projection.__v=0] - 返回结果中默认排除字段__v
     * @param {String} [mode="precise"] - 默认采用精确匹配模式 "precise":精确匹配检索; "fuzzy":模糊匹配检索
     */
    async find(params, projection = { __v: 0 }, searchMode = "precise") {
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
    async findMany(params, projection = { __v: 0 }, searchMode = "precise", recursion = false) {
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
        let res = await Menu.find(params, projection)
        if (res) {
            if (recursion) {
                // 如果需要循环获取相关的菜单
                for (let menu of res) {
                    const findRelatedDocs = await Menu.find({
                        $or: [{ parentId: { $all: [menu._id] } }, { _id: { $in: menu.parentId } }]
                    })
                    // 如果relatedDoc的parentId{Array}当中带有menu._id, 说明当前menu是relatedDoc的父级菜单中的一环,所以relatedDoc要提取
                    // 如果relatedDoc的_id 在 menu.parentId{Array}当中, 说明当前menu是relatedDoc的子级菜单中的一环,所以relatedDoc要提取
                    // 总结: 提取关联菜单

                    //对于获取的记录findRelatedDocs肯定存在多处重复值, 所以要和初始获取的记录进行去重处理
                    let obj = {}
                    res = [...res, ...findRelatedDocs].reduce((prev, curr) => {
                        //当对象里没有所传属性时，给属性true并PUSH数组
                        obj[curr._id] ? '' : (obj[curr._id] = true && prev.push(curr))
                        return prev
                    }, [])
                }
            }

            return res //后续对菜单列表进行树形结构拼接的工作在controller层进行
        }
        return false

    },

    /**
     * 更新菜单(单个)
     * @param {Array} _id - 菜单 id
     * @param {Object} params  - 要更新的字段信息
     */
    async updateById(_id, params) {
        let res = await Menu.findByIdAndUpdate(_id, { ...params, updateTime: new Date() })
        if (res) return res
        return false
    },

    /**
     * 删除菜单(单个)
     * @param {Array} _id - 菜单 id
     * @param {Object} params  - 要删除的字段信息
     */
    async deleteById(_id, params) {
        let res = await Menu.findByIdAndDelete(_id)
        // 除了删除该记录外, 还需要删除parentId里面包含该_id的记录, 也就是将子级的菜单一并删除, 避免造成菜单层级混乱
        let delRelatedDocs = await Menu.deleteMany({ parentId: { $all: [_id] } })
        if (res && delRelatedDocs) return res
        return false
    },


}