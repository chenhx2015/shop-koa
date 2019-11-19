const  goods = require( './goods') // 首页数据列表

module.exports = (router, sqlConnection) => {
    // 所有接口都遵循 restful 接口规范
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

    // 暂时忽略以下
    .post('/mall', (ctx, next) =>{
        const id = ctx.params.id;
        const goods = goods.create(id)
        ctx.body = goods
        next()
    })
    // 替换除了ID之外的其他字段
    .put('/mall' + ':/id', (ctx, next) =>{
        const id = ctx.params.id;
        const goods = goods.replace(id)
        ctx.body = goods
        next()
    })
    // 修改某个字段（实体的属性）
    .patch('/goods' + ':/id', (ctx, next) =>{
        const id = ctx.params.id;
        const goods = goods.modify(id)
        ctx.body = goods
        next()
    })
}