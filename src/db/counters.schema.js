
const mongoose = require('mongoose')

const counterSchema = mongoose.Schema({
    "_id": String,// 要自增字段的名字
    "sequence_value": Number,//要自增的字段
})

module.exports = mongoose.model("counters", counterSchema, "counters")