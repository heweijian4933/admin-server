/**
 * 封装http server层
 */
const log4js = require('../utils/log4j')
const { APP_PORT } = require('../config/env.js')

const app = require('../app')

app.listen(APP_PORT, () => {
  log4js.info(`admin server is running at http://localhost:${APP_PORT}`);
  log4js.info(`environment ${process.env.NODE_ENV}`);
})