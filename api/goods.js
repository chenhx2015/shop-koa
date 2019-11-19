 // 找出符合过滤条件的商品列表
const list = (sqlConnection, filter) => {
    return new Promise((resolve, reject) => {
        sqlConnection.query('select * from goods_list', (error, results, fields) => {
            if (error) {
                reject(error)
            }
            resolve(JSON.parse(JSON.stringify(results))) 
        })
    })
}

// 删除商品
const remove = (sqlConnection, id) =>{
    return new Promise((resolve, reject) => {
        sqlConnection.query('DELETE FROM goods_list WHERE id=' + id, (error, results, fields) => {
            if (error) reject(error)
            console.log('results', results)
            resolve(results)
        })
    })
}

// 创建商品（即添加商品）
const create = (sqlConnection, newGoods) => {
    return new Promise((resolve, reject) => {
        sqlConnection.query('INSERT INTO goods_list (img, name, price, qty) VALUES (?, ?, ?, ? )', [ newGoods.img , newGoods.name , newGoods.price ,newGoods.qty ], function(error, results, fields) {
            if (error) reject(error)
            console.log('results', results);
            resolve(results.insertId)
        });
    })
}
// 修改商品
const modify = (sqlConnection, id, name, img, price, qty) =>{
    return new Promise((resolve, reject) => {
        let sql = 'update goods_list set ? where id=' + id
        let obj = {}
        if (name) {
            obj.name = name
        }
        if (img) {
            obj.img = img
        }
        if (price) {
            obj.price = price
        }
        if (qty) {
            obj.qty = qty
        }
        sqlConnection.query(sql, obj, (error, results, fields) => {
            if (error) reject(error)
            resolve(results.changedRows)
        })
    })
}

module.exports = {
    list:list, 
    create:create, 
    remove:remove, 
    modify:modify
} 