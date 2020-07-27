const _ = require('lodash')
const path = require('path')
const axios = require('axios')
const cookies = require('../auth/login')
const fs = require('fs')
const qs = require('qs')

function getProductPath(){
    return path.resolve(__dirname, "../python-task/data-sheet/prod.json")
}

function getDetails(productIds,taskId){
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

function getDetail(productId,taskId){
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

function release(products){
    products = _.castArray(products)
    products = [products[0]]
    products.forEach(product => {
        product.item.name = 'refreshd:' + product.item.name
        //console.log(product)
        data = product
        //data = qs.stringify(product, { arrayFormat: 'brackets' })
        //console.log(data)
        try {
            axios.post('https://fril.jp/item/validate',data,{
            cookies:"_ra=1593332952428|23099db8-3a17-470e-9a72-8bce3dd5e074; _ga=GA1.2.1999933104.1593332952; _fbp=fb.1.1594610025071.236646165; __gads=ID=70088d27be40d614:T=1593332953:S=ALNI_MbuN15fTWskyScpKIMBl5V94LiUsw; recently_browsing_items=337644317%2C337641212%2C337607051%2C337616733; _gid=GA1.2.444561271.1595824654; _gat=1",//cookies,
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
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