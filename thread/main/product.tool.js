const _ = require('lodash')
const path = require('path')
const axios = require('axios')
    //const cookies = require('../auth/login')
const fs = require('fs')
const qs = require('qs')


function getProductPath() {
    return path.resolve(__dirname, "../../crawler/python-task/data-sheet/prod.json")
}

function getDetails(productIds, taskId) {
    console.log('getDetails')
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

module.exports = {
    getDetail,
    getDetails
}