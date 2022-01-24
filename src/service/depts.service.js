const Dept = require('../db/depts.schema')
const log4js = require('../utils/log4j')
const util = require('../utils/util')
const ObjectId = require('mongoose').Types.ObjectId //mongoose的type对象, 用于新增_id
// 获取全局userSchema字段
const schemaKeys = Object.keys(Dept.schema.tree);
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
     * 添加部门
     * @param {Object} params
     * @param {String} params.deptName - 部门名称
     * @param {String} params.userName - 部门备注
     * @param {Array} params.permissionList - 部门权限列表
     */
    async add(params) {
        const _id = new ObjectId().toString()
        let res = await Dept.create({ _id, ...params, createTime: new Date(), updateTime: null })
        if (res) return res.toObject()
        return false
    },

    /**
     * 查找单个部门
     * @param {Object} params - 查找的字段根据
     * @param {Object=} [projection={ __v: 0 }] - 返回结果中要排除的字段
     * @param {Number || Boolean} [projection.__v=0] - 返回结果中默认排除字段__v
     * @param {String} [mode="precise"] - 默认采用精确匹配模式 "precise":精确匹配检索; "fuzzy":模糊匹配检索
     */
    async find(params, projection = { __v: 0 }, searchMode = "precise") {
        // 默认projection = { userPwd: 0 }, 表示默认不返回部门密码字段
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
        let res = await Dept.findOne(params, projection)
        if (res) return res.toObject()
        // 返回的res是一个mongoose Model对象,需要用附带的toObject方法处理成纯粹的对象格式
        return false

    },

    /**
     * 查找多个部门(分页 或者 不分页)
     * @param {Object} params - 查找的字段根据
     * @param {Object=} [projection={ __v: 0 }] - 返回结果中 要排除的字段
     * @param {String} [mode="precise"] - 默认采用精确匹配模式 "precise":精确匹配检索; "fuzzy":模糊匹配检索
     */
    async findMany(params, pager, projection = { __v: 0 }, searchMode = "precise", recursion = false) {
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
            const query = Dept.find(params, projection)
            res = await query.skip(skipIndex).limit(page.pageSize)
        } else {//如果不需要分页
            res = await Dept.aggregate(
                [{ $match: params },
                { $project: projection },
                {
                    $lookup: {     //定义规则
                        from: 'users',   //在users集合中查找
                        localField: "userId",   //当前查询的字段
                        foreignField: "userId",   //对应order_item集合的哪个字段
                        as: "user"            //在查询结果中键值
                    },

                },
                {
                    "$project": {
                        "_id": 1,
                        "userId": 1,
                        "parentId": 1,
                        "deptName": 1,
                        "userName": { "$arrayElemAt": ["$user.userName", 0] },
                        "userEmail": { "$arrayElemAt": ["$user.userEmail", 0] },
                        "mobile": { "$arrayElemAt": ["$user.mobile", 0] },
                        "createTime": 1,
                        "updateTime": 1
                    }
                },

                    // project只返回前端需要的字段
                ]
            )
        }
        count = await Dept.countDocuments()
        if (res) {
            if (recursion) {
                // 如果需要循环获取相关的菜单
                for (let dept of res) {
                    const findRelatedDocs = await Dept.find({
                        $or: [{ parentId: { $all: [dept._id] } }, { _id: { $in: dept.parentId } }]
                    })
                    // 如果relatedDoc的parentId{Array}当中带有dept._id, 说明当前dept是relatedDoc的父级菜单中的一环,所以relatedDoc要提取
                    // 如果relatedDoc的_id 在 dept.parentId{Array}当中, 说明当前dept是relatedDoc的子级菜单中的一环,所以relatedDoc要提取
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
            return { list: res, total: count }
        }
        return false

    },

    /**
     * 更新部门(单个)
     * @param {Array} _id - 部门 id
     * @param {Object} params  - 要更新的字段信息
     */
    async updateById(_id, params) {
        let res = await Dept.findByIdAndUpdate(_id, { ...params, updateTime: new Date() })
        if (res) return res
        return false
    },

    /**
     * 删除部门(单个)
     * @param {Array} _id - 部门 id
     */
    async deleteById(_id) {
        let res = await Dept.findByIdAndDelete(_id)
        if (res) return res
        return false
    },


}