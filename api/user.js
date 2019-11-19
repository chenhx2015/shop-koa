/*
 * 用户的一些信息: 
 * 用户ID： uid
 * 用户名（账号）：username
 * 密码：pwd
*/

// 获取用户信息 @todo 待确认是否是通过ID来判断用户
const get = (sqlConnection, id) => {
    return new Promise((resolve, reject) => {
        sqlConnection.query('select * from user where id=' + id, (error, results, fields) => {
            if (error) {
                reject(error)
                return
            }
            resolve(results[0])
        })
    })
}

// 创建用户（注册）
const create = (sqlConnection, username, pwd) => {
    return new Promise((resolve, reject) => {
        sqlConnection.query('insert into user (username, pwd) values (?, ?)', [username, pwd], (error, results, fields) => {
            if (error) {
                reject(error)
                return
            }
            // 把注册时创建的用户ID返回给前端，前端从响应体里面拿到用户ID之后，放到头部，供下次请求使用，下次请求后端在请求头部提取出来
            resolve(results.insertId)
        })
    })
}

// 删除用户（注销）
const remove = (sqlConnection, id) => {
    return new Promise((resolve, reject) => {
        sqlConnection.query('delete from user where id=' + id, (error, results, fields) => {
            if (error) {
                reject(error)
                return
            }
            resolve(results)
        })
    })
}

// 修改用户（除账号之外，其他的都能修改）
const modify = (sqlConnection, id, pwd) => {
    return new Promise((resolve, reject) => {
        sqlConnection.query('update user set pwd=' + pwd + ' where id=' + id, (error, results, fields) => {
            if (error) {
                reject(error)
                return
            }
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

