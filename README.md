# koa2 项目

2022/2/16

- 菜单 Menu 对应的 schema 建立和增删改查接口搭建;

2022/2/15

- 完善用户接口 增加用户接口完善;
- 增加 counter.schema,用于维护一些自增的字段;

2022/2/14

- 完善用户接口 增删改查;
- 优化 user.service 查询逻辑,实现模糊查询功能;

2022/2/13

- 完善用户接口 增删改查;

2022/2/10

- 完善登陆接口
- 增加用户模块中间件,初始化 token 校验

2022/01/08

- 修改 log4j error 级别导出文件的命名 bug
- 调整环境变量配置文件 config/index.js=>env.js
- 引入 mongoose 和 配置数据库
- 封装成功返回和失败返回 到工具类 utils 中
- 将常用的错误码封装到 config/err.type.js
- login 接口初步调联,具体业务逻辑待修正

2022/01/08

- 修改 log4j error 级别导出文件的命名 bug
- 调整环境变量配置文件 config/index.js=>env.js
- 引入 mongoose 和 配置数据库
- 封装成功返回和失败返回 到工具类 utils 中
- 将常用的错误码封装到 config/err.type.js
- login 接口初步调联,具体业务逻辑待修正

2022/01/07

- log4js 封装, 统一输出日志管理
- 接口文档模块 swagger 和 jsdoc 配置

2022/01/06

- 项目初始化
- 环境变量配置(.env 和 config)
- 动态路由封装
- 拆分 app 层和 http server 服务层(bin/server.js)
- 拆分 controller 层,service 层和 middleware 层

项目环境设置

```
prod 	--正式环境/工作环境
dev 	--开发环境
test	--测试环境
```

> 对应环境变量设置
>
> ```
> .env.dev
> .env.prod
> .env.test
> ```
>
> 以及 packages.js 变量的统一识别导入(通过 cross-env 管理)
>
> ```
> // packages.json
>
> "scripts": {
>     "dev": "cross-env NODE_ENV=dev ./node_modules/.bin/nodemon ./src/bin/server.js",
>     "prod": "cross-env NODE_ENV=prod pm2 start ./src/bin/server.js",
>     "test": "cross-env NODE_ENV=test pm2 start ./src/bin/server.js"
>   },
> ```
