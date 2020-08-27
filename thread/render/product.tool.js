const { remote } = require('electron')
const _ = require('lodash')
const qs = require('qs')
const axios = require('axios')
const store = remote.getGlobal('store')
const AppPath = remote.app.getAppPath().replace(/\\/g,'/')

axios.defaults.withCredentials = true
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
            console.log('key',key)
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
                }).then(({data}) => {
                    console.log('success')
                    console.log(data)
                    if (data.result) {
                        return axios({
                            url:`https://fril.jp/ajax/category/${f.get('item[category_id]')}`,
                            method:'get'
                        })
                    }
                    return Promise.reject({ message: 'validate fail' })
                    
                }).then(res => {
                    const f1 = new FormData()
                    f1.append('category_id',f.get('item[category_id]'))
                    f1.append('name',f.get('item[name]'))
                    f1.append('detail',f.get('item[detail]'))
                    f1.append('price',f.get('item[sell_price]'))
                    f1.append('status',f.get('item[status]'))
                    f1.append('delivery_method',f.get('item[delivery_method]'))
                    f1.append('parent_category_id',res.data)
                    return axios({
                        url:'https://fril.jp/ajax/warning_display_sell',
                        method:'post',
                        data:f1,
                        headers: {
                            'cookie': store.cookie,
                            'x-csrf-token':store.authenticity_token,
                            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryBaMIW47uRAAJ0KkE',
                            'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.119 Electron/9.0.5 Safari/537.36',
                            'x-requested-with': 'XMLHttpRequest'
                        }

                    })
                }).then(({ data }) => {
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
                    

                }).then(res => {
                    // console.log('++++++category',res.data)
                    // f.set('item[category_id]',res.data)
                    // 285555 => 109923
                    //res {selling_fee:109923}
                    return Promise.all(product.imgs.map((imgUrl,index) => {
                        // const filePath = 'file:///' + AppPath  + '/python-task/data-sheet/images/full/' + product.id + `/img.${index}.jpg`
                        // console.log('filePath',filePath)
                        return new Promise((resolve,reject) => {
                            const request = remote.net.request(imgUrl)
                            request.on('response',response => {
                                response.on('data', (chunk) => {
                                    console.log('chunk',chunk)
                                    resolve(chunk)
                                  })
                                  response.on('end', res => {
                                    console.log('No more data in response.')
                                  })
                                  response.on('error', res => {
                                    reject(res)
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
                        return Promise.all(imgBlobs.map((imgBlob, index) => {
                            return new Promise((resolve,reject) => {
                                const partals = product.imgs[index].split('/')
                                const fileName = partals[partals.length - 1].split('?')[0]
                                var fileReader = new FileReader();
                                fileReader.readAsBinaryString(imgBlob);//以BASE64编码格式读取文件                                    
                                fileReader.onloadend = function(evt) {                                      
                                    // console.log("evt.target" + evt.target);
                                    // console.log("evt.target.result len = " +evt.target.result.length);
                                    // console.log("evt.target.result  = " +evt.target.result);
                                    
                                    //base64编码格式转file格式
                                    var aa = evt.target.result;
                                    var arr = aa.split(','),
                                    mime = arr[0].match(/:(.*?);/)[1],
                                            bstr = atob(arr[1]),
                                            n = bstr.length,
                                            u8arr = new Uint8Array(n);
                                        while (n--) {
                                            u8arr[n] = bstr.charCodeAt(n);
                                        }
                                        var fileResult = new File([u8arr], fileName, { type: mime });
                                    console.log(fileResult);
                                    resolve(fileResult);
                                }        
                            })
                            


                            // const partals = product.imgs[index].split('/')
                            // const fileName = partals[partals.length - 1].split('?')[0]
                            
                            // imgBlob = imgBlob.toString()
                            // console.log('string blob',imgBlob)
                            // return { imgBlob, fileName }
                        }))
                    }).then(data => {
                        
                        console.log('data',data)
                        const fm = new FormData()
                        // fm.append('item_img_ids[]','')
                        // f.append('updates[]',1) //？？
                        // f.append('set_images[]',1)//？？
                        // fm.append('crop_x[]','')
                        // fm.append('crop_y[]','')
                        // fm.append('crop_size[]','')
                        fm.append('utf8',f.get('utf8'))
                        fm.append('authenticity_token',f.get('authenticity_token'))
                        fm.append('item_img_ids[]','')
                        fm.append('updates[]',1)
                        fm.append('set_images[]',1)
                        fm.append('crop_x[]','')
                        fm.append('crop_y[]','')
                        fm.append('crop_size[]','')

                        fm.append('item_img_ids[]','')
                        fm.append('updates[]','')
                        fm.append('set_images[]','')
                        fm.append('crop_x[]','')
                        fm.append('crop_y[]','')
                        fm.append('crop_size[]','')

                        fm.append('item_img_ids[]','')
                        fm.append('updates[]','')
                        fm.append('set_images[]','')
                        fm.append('crop_x[]','')
                        fm.append('crop_y[]','')
                        fm.append('crop_size[]','')

                        fm.append('item_img_ids[]','')
                        fm.append('updates[]','')
                        fm.append('set_images[]','')
                        fm.append('crop_x[]','')
                        fm.append('crop_y[]','')
                        fm.append('crop_size[]','')

                        fm.append('item[brand_id]','')
                        fm.append('item[category_id]',f.get('item[category_id]'))
                        
                        fm.append('item[name]',f.get('item[name]'))
                        fm.append('item[detail]',f.get('item[detail]'))
                        fm.append('item[status]',f.get('item[status]'))
                        fm.append('item[carriage]',1)
                        fm.append('item[delivery_method]',f.get('item[delivery_method]'))
                        fm.append('item[delivery_date]',f.get('item[delivery_date]'))
                        fm.append('item[delivery_area]',f.get('item[delivery_area]'))
                        fm.append('item[request_required]',f.get('item[request_required]'))
                        fm.append('item[sell_price]',f.get('item[sell_price]'))
                        data.forEach(item => {
                            
                            //var blob = new Blob(item.imgBlob, {type: 'image/*'});
                            //fm.append('images[]',blob)
                            //const file = new File([item.imgBlob],item.fileName,{type:'image/jpg'})
                            fm.append('images[]',item)
                            // console.log('file',file)
                            // fm.append('img', file)
                        })

                        console.log('formData',fm)
                        // return new Promise((resolve,reject) => {
                        //     const request = remote.net.request({
                        //         url:'https://fril.jp/item',
                        //         method:'POST',
                        //         headers:{
                        //             cookie: store.cookie,
                        //             'X-CSRF-Token':store.authenticity_token,
                        //             'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryxFfaB4KnLxhq5Ukg',
                        //             // 'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
                        //             'X-Requested-With': 'XMLHttpRequest'
                        //         }
                        //     })
                        //     console.log('request',request.getHeader('Content-Type'))
                        //     request.on('response',response => {
                        //         response.on('data', (chunk) => {
                        //             console.log('chunk +',chunk.toString('utf-8'))
                        //             resolve(chunk)
                        //           })
                        //           response.on('end', res => {
                        //             console.log('No more data in response. +')
                        //           })
                        //           response.on('error', res => {
                        //             reject(res)
                        //           })
                        //     })
                        //     request.end()
                        // })
                        return axios({
                            url: '/item',
                            method: 'POST',
                            withCredentials:true,
                            data: fm,
                            headers: {
                                //'cookie': store.cookie,
                                'x-csrf-token':store.authenticity_token,
                                'content-type': 'multipart/form-data;',
                                'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.119 Electron/9.0.5 Safari/537.36',
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