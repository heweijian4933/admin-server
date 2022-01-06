/**
 * 环境变量统一配置
 */
const dotenv = require('dotenv')
const path = require('path')

let envName = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : 'prod'
dotenv.config({
    path: path.resolve(process.cwd(), envName)
})

// console.log(process.env.APP_PORT)

module.exports = process.env