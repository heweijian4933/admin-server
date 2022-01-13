module.exports = {
    // SUCCESS: 200,
    PARAM_ERROR: { code: 10001, msg: '参数错误' }, // 参数错误
    USER_ACCOUNT_ERROR: { code: 20001, msg: '账号或者密码错误' }, //账号或密码错误
    USER_LOGIN_ERROR: { code: 30001, msg: '用户未登录' }, // 用户未登录
    BUSINESS_ERROR: { code: 40001, msg: '业务请求失败' }, //业务请求失败
    AUTH_ERROR: { code: 50001, msg: '认证失败或者 Token 已过期' }, // 认证失败或TOKEN过期
}