
const list = (sqlConnection, filter) => {
    // 找出符合过滤条件的商品列表
    return new Promise((resolve, reject) => {
        sqlConnection.query('select * from goods_list', (error, results, fields) => {
            if (error) {
                reject(error)
            }
            resolve(JSON.parse(JSON.stringify(results))) 
        })
    }) 
    // const goodsList = 。。。。
    // return all goods
}

const get = (id) =>{
    //find goods then return 
    return goods;
}

const create = (tille, img, price, qty) => {
    //create new googds then return
    return goods;
}


const replace = (id, tille, img, price, qty) => {
    // find goods
    
    // replace content

    //return replaced goods
    return goods
}

const modify = (id, title, img, price, qty) =>{
    // find goods
    
    // modify content

    //return modified goods
}


const remove = (id) =>{
    // find goods
    
    // remove it 

    //return true of false 
}

module.exports = {
    list:list, 
    create:create, 
    remove:remove, 
    modify:modify, 
    replace:replace, 
    get:get
} 