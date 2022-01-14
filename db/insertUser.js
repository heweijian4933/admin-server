const { formatDate } = require('../src/utils/util.js')
function inserUser(startId, num) {
    let tpl = ''
    for (let i = 0; i < num; i++) {

        let userId = startId + i
        let userName = `user${userId}`
        let userEmail = `user${userId}@manager.com`
        let mobile = 13788888836 + i * 2
        let sex = i % 2
        let job = ["前端小咯咯", "产品经理", "前端高级开发", "前端架构师", "测试", "UI"][i % 5]
        let state = [1, 2, 3][i % 3]
        let date = (new Date).toISOString()
        console.log({ userId, userName, userPwd: "$2a$10$g5xFdHTYBhJsMTy.ZIvJkOlD5T5vLlqfGJVqzM6nrGSIgfRRKjDnG", userEmail, mobile, sex, deptId: [], job, state, role: 1, roleList: [], createTime: date, lastLoginTime: date });
        let user = { userId, userName, userPwd: "$2a$10$g5xFdHTYBhJsMTy.ZIvJkOlD5T5vLlqfGJVqzM6nrGSIgfRRKjDnG", userEmail, mobile, sex, deptId: [], job, state, role: 1, roleList: [], createTime: date, lastLoginTime: date }
        let result = JSON.stringify(user)
        result = result.replace(/\\"/, '')
        tpl += `db.getCollection("users").insert(${result})` + '\n'
        // db.getCollection("users").insert({ userId, userName, userPwd: "$2a$10$g5xFdHTYBhJsMTy.ZIvJkOlD5T5vLlqfGJVqzM6nrGSIgfRRKjDnG", userEmail, mobile, sex, deptId: [], job, state, role: 1, roleList: [], createTime: date, lastLoginTime: date })
    }
    console.log(tpl);

}

inserUser(startId = 1000001, num = 25)
// ISODate("2012-07-14T01:00:00+01:00")