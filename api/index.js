

const  goods = require( './goods') // 首页数据列表

module.exports = (router, sqlConnection) => {
    // 所有接口都遵循 restful 接口规范
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
    // .get('v1/goods/id' + ':/id', (ctx, next) =>{
    //     const id = ctx.params.id;
    //     const goods = goods.get(id)
    //     ctx.body = goods
    //     next()
    // })
    .post('/v1/goods', async(ctx, next) => {
        // 新增商品
        const newGoods = {
            img: ctx.request.body.img,
            name: ctx.request.body.name,
            price: ctx.request.body.price,
            qty: ctx.request.body.qty
        }
        console.log('newGoods', newGoods)
        ctx.body = await goods.create(sqlConnection, newGoods);
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
    // .del('/mall' + '/:id', (ctx, next) =>{
    //     const id = ctx.params.id;
    //     const isSucceed = goods.remove(id)
    //     ctx.body = isSucceed
    //     next()
    // })
}