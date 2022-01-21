
const mongoose = require('mongoose')

const deptSchema = mongoose.Schema({
    "_id": String,//mongoose 默认主键, //设定为String以后,每次新增记录时需要传入_id字段参数
    "parentId": [String],//父对象Id，一级部门默认为null
    "deptName": String,//部门名称
    "userId": String,//负责人用户ID
    "createTime": {
        type: Date,
        default: Date.now()
    },//创建时间
    "updateTime": {
        type: Date,
        default: Date.now()
    },//更新时间
})

module.exports = mongoose.model("depts", deptSchema, "depts")