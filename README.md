# koa2 项目

2022/01/07

- log4js封装, 统一输出日志管理
- 接口文档模块swagger和jsdoc配置



2022/01/06

- 项目初始化
- 环境变量配置(.env和config)
- 动态路由封装
- 拆分app层和http server服务层(bin/server.js)
- 拆分controller层,service层和middleware层



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
> 以及packages.js 变量的统一识别导入(通过cross-env管理)
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
>
> 
