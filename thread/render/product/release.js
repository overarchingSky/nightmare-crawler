import _ from 'lodash'
export function release(products, token) {
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
                        val = token //'pekt/eH1FzhSCLJyl5tg+hBJd5xEYc9idWQ5akPn8pkd7nZXEjUqQCgU2AvjpKvGo25X82xlI2ItHjuozD88uA=='
                    }

                    f.append(key, val)
                })
                // console.log(f)
                // authenticity_token和cookies具有一定的关联，firl校验了其有效性
        try{
            axios({
                    url: 'https://fril.jp/item/validate',
                    method: 'post',
                    data: f,
                    headers: {
                        cookies: document.cookie,
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
