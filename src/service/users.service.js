const User = require('../db/users.schema')
const log4js = require('../utils/log4j')
const util = require('../utils/util')

const schemaKeys = Object.keys(User.schema.tree);
/**
 * 
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
            match[key] = 0
        }

    })
    return match
}

module.exports = {

    /**
     * 添加用户
     * @param {string} userName 
     * @param {string} userPwd 
     */
    async addUser({ userName, userPwd }) {
        const res = await User.findOne({ userName })
        return res
    },

    /**
     * 查找单个用户
     * @param {object} {userName} 
     * @param {object} projection
     */
    async findUser({ userName, }, projection = { userPwd: 0, _id: 0 }) {
        // 默认projection = { userPwd: 0 }, 表示默认不返回用户密码字段
        projection = handleProjection(projection)
        let res = await User.findOne({ $or: [{ userName, }, { userEmail: userName }] }, projection)
        console.log(res);
        if (res) return res.toObject()
        // 返回的res是一个mongoose Model对象,需要用附带的toObject方法处理成纯粹的对象格式
        // [警告]:如果res带用户密码,在controller层需要做处理,禁止暴露到前端
        return false

    },

    /**
     * 查找多个用户
     * @param {object} params 
     * @param {object} pager 
     * @param {object} projection 
     */
    async findManyUsers(params, pager = util.pager({}), projection = { userPwd: 0, _id: 0 }) {
        projection = handleProjection(projection)
        const { page, skipIndex } = pager //默认值见utils/util.pager
        const query = User.find(params, projection)
        const res = await query.skip(skipIndex).limit(page.pageSize)
        console.log("res=>", res);
        if (res) return []
        // 返回的res是一个mongoose Model对象,需要用附带的toObject方法处理成纯粹的对象格式
        // [警告]:如果res带用户密码,在controller层需要做处理
        return false

    }

}