/**
 * 数据库配置
 */

const mongoose = require("mongoose")
const log4js = require('../utils/log4j')
const { DB_PORT, DB_HOST, DB_IP, DB_DATABASE } = require('../config/env')
const url = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', () => {
    log4js.error("***数据库连接失败***")
})

db.on('open', () => {
    log4js.info("***数据库连接成功***")
})