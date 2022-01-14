const User = require('../db/users.schema')
const log4js = require('../utils/log4j')
const util = require('../utils/util')

// 获取全局userSchema字段
const schemaKeys = Object.keys(User.schema.tree);
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
     * 添加用户
     * @param {Object} params - 查找的字段根据
     * @param {String} params.userName - 用户姓名
     * @param {String} params.userPwd - 用户密码
     */
    async createUser({ userName, userPwd }) {
        const res = await User.create({ userName, userPwd })
        return res
    },

    /**
     * 查找单个用户
     * @param {Object} params - 查找的字段根据
     * @param {Object=} [projection={ userPwd: 0, _id: 0 }] - 返回结果中要排除的字段
     * @param {Number || Boolean} [projection.userPwd=0] - 返回结果中默认排除密码
     * @param {Number || Boolean} [projection._id=0] - 返回结果中默认排除字段id
     * @param {String} [mode="precise"] - 默认采用精确匹配模式 "precise":精确匹配检索; "fuzzy":模糊匹配检索
     */
    async findUser(params, projection = { userPwd: 0, _id: 0 }, searchMode = "precise") {
        // 默认projection = { userPwd: 0 }, 表示默认不返回用户密码字段
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
        let res = await User.findOne(params, projection)

        console.log(res);
        if (res) return res.toObject()
        // 返回的res是一个mongoose Model对象,需要用附带的toObject方法处理成纯粹的对象格式
        // [警告]:如果res带用户密码,在controller层需要做处理,禁止暴露到前端
        return false

    },

    /**
     * 查找多个用户
     * @param {Object} params - 查找的字段根据
     * @param {Object} [pager={ pageNum: '1', pageSize: '10' }] - 查找的字段根据
     * @param {Object=} [projection={ userPwd: 0, _id: 0 }] - 返回结果中要排除的字段
     * @param {Number || Boolean} [projection.userPwd=0] - 返回结果中默认排除密码
     * @param {Number || Boolean} [projection._id=0] - 返回结果中默认排除字段id
     * @param {String} [mode="precise"] - 默认采用精确匹配模式 "precise":精确匹配检索; "fuzzy":模糊匹配检索
     */
    async findManyUsers(params, pager = util.pager({}), projection = { userPwd: 0, _id: 0 }, searchMode = "precise") {
        projection = handleProjection(projection)
        const { page, skipIndex } = pager //默认值{ page:{ pageNum: 1, pageSize: 10 }, skipIndex:0 }见utils/util.pager
        if (searchMode === "fuzzy") {
            for (key in params) {
                let value = params[key]
                if (Object.prototype.toString.call(value).includes('String') || key === 'userId') {
                    // 如果该类型是字符串才进行模糊检索
                    let reg = new RegExp(value, 'i')
                    params[key] = reg
                }
            }
        }
        console.log(params);
        const query = User.find(params, projection)
        const res = await query.skip(skipIndex).limit(page.pageSize)
        // const count = await User.find(params).countDocuments()
        const count = await User.countDocuments(params)
        if (res) return { list: res, total: count }
        // [警告]:如果res带用户密码,在controller层需要做处理
        return false

    }



}