/*
 * 购物车的一些信息: 
 * 商品ID： id
 * 用户ID：uid 作为外键,取出商品列表里面的商品
*/
// 查询购物车信息
const get = (sqlConnection, uid) => {
    return new Promise((resolve, reject) => {
        // @todo 可以直接优化SQL语句？
        sqlConnection.beginTransaction(err => {
            if (err) {
                reject()
                return
            }
            sqlConnection.query('select id from cart where uid=' + uid, (error, results, fields) => {
                if (error) {
                    return sqlConnection.rollback(function() {
                        reject(error)
                    });
                }
                sqlConnection.query('select * from cart_detail where cart_id=' + results[0].id, (error, results, fields) => {
                    if (error) {
                        return sqlConnection.rollback(() => {
                            reject(error)
                            return
                        })
                    }
                    sqlConnection.commit(err => {
                        if (err) {
                            return sqlConnection.rollback(() => {
                                reject(err)
                                return
                            })
                        }
                        resolve(results)
                    })
                })
            })
        })
    })
}

// 增加商品至购物车 （id, img, name, price, qty）
const create = (sqlConnection, uid, gid, img, name, price, qty) => {
    return new Promise((resolve, reject) => {
        let status = 0 // 0：添加进购物车， 1：从购车变为订单
        let create_time = new Date()
        sqlConnection.beginTransaction(err => {
            if (err) {
                reject(err)
                return
            } 
            sqlConnection.query('insert into cart ( uid, status, create_time) values (?, ?, ?)', [uid, status, create_time], (error, results, fields) => {
                if (error) {
                    return sqlConnection.rollback(function() {
                        reject(error)
                    });
                } 
                sqlConnection.query('insert into cart_detail (cart_id, goods_id, img, name, price, qty) values (?, ?, ?, ?, ?, ?)', [results.insertId, gid, img, name, price,qty], (error, results, fields) => {
                    if (error) {
                        return sqlConnection.rollback(() => {
                            reject(error)
                            return
                        })
                    }
                    sqlConnection.commit(err => {
                        if (err) {
                            return sqlConnection.rollback(() => {
                                reject(err)
                                return
                            })
                        }
                        resolve(results.insertId)
                    })
                })
            })
        })
    })
}

// 删除购物车商品
const remove = (sqlConnection, cart_id, uid, goods_id) => {
    return new Promise((resolve, reject) => {
        sqlConnection.beginTransaction(err => {
            if (err) {
                reject(err)
                return
            } 
            // 先删除从表（cart_detail）里面的数据，再删除主表 (cart) 里面的数据
            sqlConnection.query('delete from cart_detail where cart_id=? and goods_id=?', [cart_id, goods_id],  (error, results, fields) => {
                if (error) {
                    return sqlConnection.rollback(() => {
                        reject(error)
                    });
                }
                sqlConnection.query('delete from cart where uid=' + uid, (error, results, fields) => {
                    if (error) {
                        return sqlConnection.rollback(() => {
                            reject(error)
                        })
                    }
                    sqlConnection.commit(err => {
                        if (err) {
                            return sqlConnection.rollback(() => {
                                reject(err)
                                return
                            })
                        }
                        resolve(results.insertId)
                    })
                })
            })
        })
    })
}

// 修改购物车商品（如增加某件购物车已有的商品数量）
const modify = (sqlConnection, id) => {
    return new Promise((resolve, reject) => {
        sqlConnection.query('', (error, results, fields) => {
            if (error) reject(error)
            resolve(results)
        })
    })
}

module.exports = {
    get,
    create,
    remove,
    modify
}