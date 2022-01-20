const User = require('../db/users.schema')
const Counters = require('../db/counters.schema')
const log4js = require('../utils/log4j')
const util = require('../utils/util')
const ObjectId = require('mongoose').Types.ObjectId
// 获取全局userSchema字段
const schemaKeys = Object.keys(User.schema.tree);
/**
 * 处理传入字段
 * @param {object} projection 
 */
const handleProjection = (projection = { __v: 0 }) => {
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
     * 添加用户
     * @param {Object} params - 查找的字段根据
     * @param {String} params.userId - 用户ID ,字符串数字, 必须
     * @param {String} params.userName - 用户姓名 必须
     * @param {String} params.userPwd - 用户密码 必须
     * @param {String} params.userEmail - 用户邮箱 必须
     * @param {Array} params.deptId - 用户所在部门 ID 必须
     */
    async add(params) {
        let {
            userId, //userId 从 couter 数据库当中获取
            userName, userEmail, //一旦创建以后则固定,一般不能修改;
            userPwd, //Todo: 增加密码修改功能
            mobile, job, state, role = 1, roleList, deptId, sex, remark
        } = params

        const _id = new ObjectId().toString()
        try {
            const { sequence_value } = await Counters.findOneAndUpdate({ '_id': "userId" }, { $inc: { sequence_value: 1 } })// 从另外维护的表查询 userId 最新值并让其自增 1
            if (sequence_value) userId = sequence_value + '' //将数字转换为 String(userId格式为 String)
            let res = await User.create({
                _id,
                userId,
                ...params,
                createTime: new Date(),
                lastLoginTime: null,
            })
            if (res) {
                res = res.toObject()
                let projectionList = ["userPwd", "_id", "__v"] // [禁止]不必要的字段暴露前端
                projectionList.forEach(key => {
                    delete res[key]
                })
                return res
            }
        } catch (err) {
            log4js.error(err.stack)
        }
        return false
    },

    /**
     * 查找单个用户
     * @param {Object} params - 查找的字段根据
     * @param {Object=} [projection={ userPwd: 0, _id: 0 }] - 返回结果中要排除的字段
     * @param {Number || Boolean} [projection.userPwd=0] - 返回结果中默认排除密码
     * @param {Number || Boolean} [projection._id=0] - 返回结果中默认排除字段id
     * @param {String} [mode="precise"] - 默认采用精确匹配模式 "precise":精确匹配检索; "fuzzy":模糊匹配检索
     */
    async find(params, projection = { userPwd: 0, _id: 0 }, searchMode = "precise") {
        // 默认projection = { userPwd: 0 }, 表示默认不返回用户密码字段
        projection = handleProjection(projection)
        if (searchMode === "fuzzy") {
            for (key in params) {
                let value = params[key]
                if (Object.prototype.toString.call(value).includes('String')) {
                    // 如果该类型是字符串或者是userId才进行模糊检索
                    let reg = new RegExp(value, 'i')
                    value = reg
                }
            }
        }
        let res = await User.findOne(params, projection)
        if (res) return res.toObject()
        // 返回的res是一个mongoose Model对象,需要用附带的toObject方法处理成纯粹的对象格式
        // [警告]:如果res带用户密码,在controller层需要做处理,禁止暴露到前端
        return false

    },

    /**
     * 查找多个用户并做分页处理
     * @param {Object} params - 查找的字段根据
     * @param {Object} [pager={ pageNum: '1', pageSize: '10' }] - 分页配置
     * @param {Object=} [projection={ userPwd: 0, __v: 0 }] - 返回结果中要排除的字段
     * @param {String} [mode="precise"] - 默认采用精确匹配模式 "precise":精确匹配检索; "fuzzy":模糊匹配检索
     */
    async findMany(params, pager, projection = { userPwd: 0, __v: 0 }, searchMode = "precise") {
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
        let res;
        if (pager) {
            const { page, skipIndex } = pager //默认值{ page:{ pageNum: 1, pageSize: 10 }, skipIndex:0 }见utils/util.pager
            const query = User.find(params, projection)
            res = await query.skip(skipIndex).limit(page.pageSize)
        } else {
            console.log("no pager");
            res = await User.find(params, projection)
        }

        const count = await User.countDocuments()
        if (res) return { list: res, total: count }
        // [警告]:如果res带用户密码,在controller层需要做处理
        return false

    },

    /**
     * 更新(单个或者多个)用户
     * @param {Array} ids - 用户 id 列表
     * @param {Object} params  - 要更新的字段信息
     */
    async updateMany(ids, params) {
        let res = await User.updateMany({ userId: { $in: ids } }, params)
        if (res && res.acknowledged) return res
        return false
    },




}