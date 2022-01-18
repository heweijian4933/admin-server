
const mongoose = require('mongoose')

const menuSchema = mongoose.Schema({
    "_id": String,//mongoose 默认主键, //设定为String以后,每次新增记录时需要传入_id字段参数
    "parentId": [String],
    "menuType": Number, //菜单类型: 1:菜单,2:按钮
    "menuState": Number, //菜单状态: 1:正常,2:停用
    "menuName": String, //菜单名称,例如:系统管理
    "menuCode": String, //权限标识, 只有menuType== 2才有,例如:user-create
    "path": String, // 路径,只有menuType == 1才有,例如/system
    "icon": String, // 图标,只有menuType == 1才有,例如el-icon-arrow-right
    "order": Number, //排序,默认升序 // Todo
    "component": String, // 引入的组件,只有menuType == 1才有,例如
    "children": Array,
    "updateTime": {
        type: Date,
        default: Date.now()
    },
    "createTime": {
        type: Date,
        default: Date.now()
    },
})

module.exports = mongoose.model("menus", menuSchema, "menus")