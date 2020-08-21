const { remote } = require('electron')
const _ = require('lodash')
const qs = require('qs')
const axios = require('axios')
const store = remote.getGlobal('store')
const AppPath = remote.app.getAppPath().replace(/\\/g,'/')
console.log('AppPath',AppPath)
    //var FormData = require('form-data');  

function release(products) {
    products = _.castArray(products)
    console.log('products', products)
        // 临时测试代码
    products.length = 1
        // 临时测试代码 end
    products.forEach(product => {
        product.item.name = 'tl:' + product.item.name.slice(5)
        const data = qs.stringify(product, { arrayFormat: 'brackets', encode: false }).split('&').map(item => item.split('='))
            //data = qs.stringify(product, { arrayFormat: 'brackets' })
        console.log('product', product)
        const f = new FormData()
        data.forEach(([key, val]) => {
            if (key === 'authenticity_token') {
                console.log('++++----authenticity_token')
                val = store.authenticity_token
            }
            if(key === 'id') return
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
                }).then(({ data }) => {
                    console.log('success')
                    console.log(data)
                    if (data.result) {
                        return axios({
                            url: 'https://fril.jp/ajax/selling_fee?amount=' + product.item.sell_price,
                            method: 'get',
                            headers: {
                                cookie: store.cookie,
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
                                'x-requested-with': 'XMLHttpRequest'
                            }
                        })

                    }
                    return Promise.reject({ message: 'validate fail' })

                }).then(res => {
                    // 285555 => 109923
                    //res {selling_fee:109923}
                    Promise.all(product.imgs.map((imgUrl,index) => {
                        // const filePath = 'file:///' + AppPath  + '/python-task/data-sheet/images/full/' + product.id + `/img.${index}.jpg`
                        // console.log('filePath',filePath)
                        return new Promise((resolve,reject) => {
                            const request = remote.net.request(imgUrl)
                            request.on('response',response => {
                                response.on('data', (chunk) => {
                                    console.log(`BODY: ${chunk}`)
                                  })
                                  response.on('end', res => {
                                    resolve(res)
                                    console.log('No more data in response.')
                                  })
                            })
                            request.end()
                        })
                        

                        // return axios({
                        //     url:imgUrl,//filePath,
                        //     method: 'get',
                        //     headers: {
                        //         'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.122 Electron/9.2.0 Safari/537.36',
                        //         // 'Sec-Fetch-Dest': 'document',
                        //         // 'Sec-Fetch-Mode': 'navigate',
                        //         // 'Sec-Fetch-Site': 'none',
                        //         // 'Sec-Fetch-User': '?1',
                        //         // 'Upgrade-Insecure-Requests': 1

                        //     },
                        //     responseType: 'blob'
                        // })
                    })).then(imgBlobs => {
                        console.log('imgBlobs',imgBlobs)
                        return imgBlobs.map((imgBlob, index) => {
                            const partals = product.imgs[index].split('/')
                            const fileName = partals[partals.length - 1].split('?')[0]
                            return { imgBlobs, fileName }
                        })
                    }).then(data => {
                        f = new FormData()
                        data.forEach(item => {
                            const file = new File(item.fileName, item.imgBlobs)
                            f.append('img', file)
                        })
                        return axios({
                            url: 'https://fril.jp/item',
                            method: 'post',
                            data: f,
                            headers: {
                                cookie: store.cookie,
                                'Content-Type': 'multipart/form-data',
                                'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
                                'x-requested-with': 'XMLHttpRequest'
                            }
                        })
                    })
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