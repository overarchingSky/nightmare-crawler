const _ = require('lodash')
const path = require('path')
const axios = require('axios')
    //const cookies = require('../auth/login')
const fs = require('fs')
const qs = require('qs')
var FormData = require('form-data');

// a = {
//     name: 'tl',
//     imgs: [1, 2, 3],
//     item: {
//         p: 3
//     }
// }

// res = qs.stringify(a, { arrayFormat: 'brackets', encode: false })
// console.log('res:')
// console.log(res)

// return

function getProductPath() {
    return path.resolve(__dirname, "../python-task/data-sheet/prod.json")
}

function getDetails(productIds, taskId) {
    return new Promise((resolve, reject) => {
        let f = fs.readFile(getProductPath(), "utf-8", function(err, data) {
            if (err) {
                reject(err)
                return
            }
            let products = []
            if (data.length > 0) {
                products = JSON.parse(data)
            }
            if (productIds) {
                productIds = _.castArray(productIds)
                resolve(products.filter(product => productIds.includes(product.id)))
                return
            }
            resolve(products)
        })
    })

}

function getDetail(productId, taskId) {
    return new Promise((resolve, reject) => {
        let f = fs.readFile(getProductPath(), "utf-8", function(err, data) {
            if (err) {
                reject(err)
                return
            }
            let products = []
            if (data.length > 0) {
                try {
                    products = JSON.parse(data)
                } catch (error) {
                    console.error(error)
                }
            }
            resolve(products.find(product => productId === product.id))
        })
    })

}

function release(products) {
    products = _.castArray(products)
    products = [products[0]]
    products.forEach(product => {
        product.item.name = 'refreshd:' + product.item.name
            //console.log(product)
        data = qs.stringify(product, { arrayFormat: 'brackets', encode: false }).split('&').map(item => item.split('='))
            //data = qs.stringify(product, { arrayFormat: 'brackets' })
            //console.log(data)
        const f = new FormData()
        data.forEach(([key, val]) => {
                if (key === 'authenticity_token') {
                    val = 'pekt/eH1FzhSCLJyl5tg+hBJd5xEYc9idWQ5akPn8pkd7nZXEjUqQCgU2AvjpKvGo25X82xlI2ItHjuozD88uA=='
                }

                f.append(key, val)
            })
            // console.log(f)
            // authenticity_token和cookies具有一定的关联，firl校验了其有效性
        try {
            axios({
                    url: 'https://sug.so.360.cn/suggest?callback=suggest_so&encodein=utf-8&encodeout=utf-8&format=json&fields=word',
                    method: 'get'
                }).then(res => {
                    console.log('success')
                    console.log(res)
                })
                .catch(error => {
                    console.log('error')
                    console.log(error)
                })
            return
            axios({
                    url: 'https://fril.jp/item/validate',
                    method: 'post',
                    data: f,
                    headers: {
                        cookies: "_ga=GA1.2.1984736633.1592139397; _ra=1592139397733|9e8f25c9-8ccd-4554-a2b6-286054002272; __gads=ID=5c1c6c7ccd156e40:T=1592139399:S=ALNI_MYW-hssEmZP9rCWwgCUoku_5iD_cA; _fril_user_session_id=c583348e50cbd0f676b015c5d57986e7; _fbp=fb.1.1593178757450.753226682; recently_browsing_items=337634297; _gid=GA1.2.1443312505.1595946072; _gat=1", //cookies,

                        'Content-Type': 'application/x-www-form-urlencoded',
                        'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
                        'x-requested-with': 'XMLHttpRequest'
                    }
                }).then(res => {
                    console.log('success')
                    console.log(res)
                })
                .catch(error => {
                    console.log('error')
                    console.log(error)
                })
        } catch (error) {
            console.log('catch error')
            console.log(error)
        }

    })
}

module.exports = {
    getDetail,
    getDetails,
    release
}