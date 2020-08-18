const { remote } = require('electron')
const _ = require('lodash')
const qs = require('qs')
const axios = require('axios')
const store = remote.getGlobal('store')
    //var FormData = require('form-data');

function release(products) {
    products = _.castArray(products)
    console.log('products', products)
    products.forEach(product => {
        product.item.name = 'tl:' + product.item.name.slice(5)
        const data = qs.stringify(product, { arrayFormat: 'brackets', encode: false }).split('&').map(item => item.split('='))
            //data = qs.stringify(product, { arrayFormat: 'brackets' })
        const f = new FormData()
        data.forEach(([key, val]) => {
            if (key === 'authenticity_token') {
                console.log('++++----authenticity_token')
                val = store.authenticity_token
            }
            f.append(key, val)
        })
        console.log('this', this)
        try {
            axios({
                    url: 'https://fril.jp/item/validate',
                    method: 'post',
                    data: f,
                    headers: {
                        cookie: store.cookie,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
                        'x-requested-with': 'XMLHttpRequest'
                    }
                }).then(res => {
                    console.log('success')
                    console.log(res)
                    if (res.result) {
                        return axios({
                            url: 'https://fril.jp/item/' + product.id,
                            method: 'post',
                            data: f,
                            headers: {
                                cookie: store.cookie,
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
                                'x-requested-with': 'XMLHttpRequest'
                            }
                        })
                    }

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
    release
}