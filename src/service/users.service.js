const User = require('../db/users.schema')

module.exports = {
    async userLogin({ username, password }) {

    },

    async userFind({ username, password }) {
        const res = await User.findOne({ username })
        console.log(res);
        return res
    }
}