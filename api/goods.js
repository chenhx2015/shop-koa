
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
}

const get = (id) =>{
    // 获取商品

    //find goods then return 
    return goods;
}

const create = (sqlConnection, newGoods) => {
    // 创建商品（即添加商品）
    return new Promise((resolve, reject) => {
        sqlConnection.query('INSERT INTO goods_list (img, name, price, qty) VALUES (?, ?, ?, ? )', [ newGoods.img , newGoods.name , newGoods.price ,newGoods.qty ], function(error, results, fields) {
            if (error) reject(error)
            // console.log(results.insertId);
            console.log('results', results);
            resolve(results.insertId)
        });
    })
}


const replace = (id, tille, img, price, qty) => {
    // 替换商品
    // find goods
    
    // replace content

    //return replaced goods
    return goods
}

const modify = (id, title, img, price, qty) =>{
    // 修改商品
    // find goods
    
    // modify content

    //return modified goods
}


const remove = (id) =>{
    // 删除商品
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