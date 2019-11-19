const  goods = require( './goods') // 首页数据列表
const user = require('./user') // 用户
const cart = require('./cart') // 购物车

module.exports = (router, sqlConnection) => {
    // 所有接口都遵循 restful 接口规范
    /*
     * 资源：商品 - goods
     */
    // 获取商品列表
    router.get('/v1/goods', async (ctx, next) =>{
        const goods_list = await goods.list(sqlConnection);
        ctx.set("Content-Type", "application/json")
        const ret = {
            code:0,
            message: '成功',
            data: {
                banner: [],
                recommend: goods_list,
                total: goods_list.length
            }
        }
        ctx.body = ret
        next() 
    })
    // 新增商品
    .post('/v1/goods', async(ctx, next) => {
        const newGoods = {
            img: ctx.request.body.img,
            name: ctx.request.body.name,
            price: ctx.request.body.price,
            qty: ctx.request.body.qty
        }
        ctx.body = await goods.create(sqlConnection, newGoods);
        next()
    })
    // 删除商品
    .delete('/v1/goods', async(ctx, next) => {
        let goods_id = ctx.request.body.goods_id
        ctx.body = await goods.remove(sqlConnection, goods_id)
        next()
    })
    // 修改商品，修改部分信息或者全部信息（ID不能修改）
    .patch('/v1/goods', async(ctx, next) => {
        let id = ctx.request.body.id
        let name = ctx.request.body.name
        let img = ctx.request.body.img
        let price = ctx.request.body.price
        let qty = ctx.request.body.qty
        ctx.body = await goods.modify(sqlConnection, id, name, img, price, qty)
        next()
    })

    /*
     * 资源：用户 - user
     */
    // 获取用户信息
    .get('/v1/user', async(ctx, next) =>{
        const id = ctx.headers.uid;
        ctx.body = await user.get(sqlConnection, id)
        next()
    })

    // 创建用户信息（注册）
    .post('/v1/user', async(ctx, next) =>{
        const username = ctx.request.body.username
        const pwd = ctx.request.body.pwd
        ctx.body = await user.create(sqlConnection, username, pwd)
        next()
    })
    // 修改用户信息
    .patch('/v1/user', async(ctx, next) =>{
        const id = ctx.headers.uid
        const pwd = ctx.request.body.pwd;
        ctx.body = await user.modify(sqlConnection, id, pwd)
        next()
    })
    // 删除用户(注销)
    .delete('/v1/user', async(ctx, next) =>{
        const id = ctx.headers.uid;
        ctx.body = await user.remove(sqlConnection, id)
        next()
    })

    /*
     * 资源：购物车 - cart
     */
    // 查询购物车信息
    .get('/v1/cart', async(ctx, next) => {
        let uid = ctx.request.headers.uid
        ctx.body = await cart.get(sqlConnection, uid)
        next()
    })
    // 增加商品至购物车
    .post('/v1/cart', async(ctx, next) => {
        let uid = ctx.request.headers.uid
        let { goods_id, img, name, price, qty } = ctx.request.body
        ctx.body = await cart.create(sqlConnection, uid, goods_id, img, name, price, qty)
        next()
    })
    // 删除购物车商品
    .delete('/v1/cart', async(ctx, next) => {
        let uid = ctx.request.headers.uid
        let { goods_id } = ctx.request.body
        ctx.body = await cart.remove(sqlConnection, uid, goods_id)
        next()
    })
    // 修改购物车商品
}