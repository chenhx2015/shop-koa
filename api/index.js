

const  goods = require( './goods') // 首页数据列表

module.exports = (router, sqlConnection) => {
    router.get('/v1/shop/index', async (ctx, next) =>{
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
    .get('/goods' + ':/id', (ctx, next) =>{
        const id = ctx.params.id;
        const goods = goods.get(id)
        ctx.body = goods
        next()
    })
    .post('/mall', (ctx, next) =>{
        const id = ctx.params.id;
        const goods = goods.create(id)
        ctx.body = goods
        next()
    })
    .put('/mall' + ':/id', (ctx, next) =>{
        const id = ctx.params.id;
        const goods = goods.replace(id)
        ctx.body = goods
        next()
    })
    .patch('/goods' + ':/id', (ctx, next) =>{
        const id = ctx.params.id;
        const goods = goods.modify(id)
        ctx.body = goods
        next()
    })
    .del('/mall' + '/:id', (ctx, next) =>{
        const id = ctx.params.id;
        const isSucceed = goods.remove(id)
        ctx.body = isSucceed
        next()
    })
}