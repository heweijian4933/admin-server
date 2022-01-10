const User = require('../db/users.schema')

module.exports = {
<<<<<<< HEAD
    async userLogin({ username, password }) {

    },

    async userFind({ username, password }) {
        const res = await User.findOne({ username })
        console.log(res);
        return res
    }
=======
    /**
     * 
     * @param {*} param0 
     */
    async addUser({ userName, userPwd }) {
        const res = await User.findOne({ userName })
        return res
    },

    async findUser({ userName, userPwd }) {
        let res = await User.findOne({ $or: [{ userName, }, { userEmail: userName }] })
        if (res) return res.toObject()
        // 返回的res是一个mongoose Model对象,需要用附带的toObject方法处理成纯粹的对象格式
        // [警告]:此处res带用户密码,在controller层需要做处理
        return false

    }

>>>>>>> c531ae8e59606710e1ec7da47107a956d664a955
}