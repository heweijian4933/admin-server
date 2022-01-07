/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: 获取功能开发列表
 *     description: 获取功能开发列表
 *     tags: [用户模块]
 *     parameters: # 请求参数
 *       - name: current
 *         description: 页码
 *         in: query # 参数的位置，可能的值有 "query", "header", "path" 或 "cookie" 没有formData，但是我加了不报错
 *         required: false
 *         type: number
 *       - page: size
 *         description: 页条数
 *         in: query
 *         required: false
 *         type: number # 可能的值有string、number、file（文件）等
 *     responses:
 *       '200':
 *         description: Ok
 *         schema:
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *               description: 状态码
 *             data:
 *               type: 'string'
 *               description: 加密公钥
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *             status:
 *               type: 'number'
 *               description: 状态
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 */
