const User = require('../db/users.schema')

module.exports = {
    /**
     * 
     * @param {*} param0 
     */
    async addUser({ userName, userPwd }) {
        const res = await User.findOne({ userName })
        return res
    },

    async findUser({ userName, userPwd }) {
        const res = await User.findOne({ userName, userPwd })
        return res
    }

}