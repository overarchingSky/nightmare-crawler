const _ = require('lodash')
const path = require('path')
const axios = require('axios')
function getProductPath(){
    return path.resolve(__dirname, "./python-task/data-sheet/prod.json")
}

module.exports = function getDetails(productIds,taskId){
    return new Promise((resolve,reject) => {
        let f = fs.readFile(getProductPath(), "utf-8", function(err, data) {
            if(err){
                reject(err)
                return
            }
            let products = []
            if(data.length > 0){
                products = JSON.parse(data)   
            }
            if(productIds){
                productIds = _.castArray(productIds)
                resolve(products.filter(product => productIds.includes(product.id)))
                return 
            }
            resolve(products)
        })
    })
    
}

module.exports = function getDetail(productId,taskId){
    return new Promise((resolve,reject) => {
        let f = fs.readFile(getProductPath(), "utf-8", function(err, data) {
            if(err){
                reject(err)
                return
            }
            let products = []
            if(data.length > 0){
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

module.exports = function release(products){
    products = _.castArray(products)
    products.forEach(product => {
        product.name = 'refreshd:' + product.name
        axios.post('https://fril.jp/item/validate',{},{})
    })
}