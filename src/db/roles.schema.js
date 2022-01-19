
const mongoose = require('mongoose')

const roleSchema = mongoose.Schema({
    "_id": String,//mongoose 默认主键, //设定为String以后,每次新增记录时需要传入_id字段参数
    "roleName": String,//角色名称
    "remark": String,//备注信息
    "permissionList": {
        "checkedKeys": [String,],//选中的子菜单
        "halfCheckedKeys": [String,],//半选中的父菜单
    },//权限列表
    "createTime": {
        type: Date,
        default: Date.now()
    },//创建时间
})

module.exports = mongoose.model("roles", roleSchema, "roles")