/**
 * 环境变量统一配置
 */
const dotenv = require('dotenv')
const path = require('path')

// 环境变量根据package.json当中script命令传入的NODE_ENV取值
// 生产环境prod应是最为保守的环境, 所以在索取环境变量值出错的时候可以采纳生产环境,防止暴露不必要的变量
let envName = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : 'prod'
dotenv.config({
    path: path.resolve(process.cwd(), envName)
})

// console.log(process.env.APP_PORT)

module.exports = process.env