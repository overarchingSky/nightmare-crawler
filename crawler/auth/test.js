//检查是否登录成功，本文件是被注入到页面内的，每次跳转页面，都会重新注入一次，即每次页面切换，都会重新执行一次
const { ipcRenderer, remote } = require('electron')
const store = remote.getGlobal('store')
window.ipcRenderer = ipcRenderer

document.addEventListener('load', () => {
    console.log('检查是否登陆')
    const logged = document.querySelector('.ga-loggedin')
    const shopEle = document.querySelector('.ga-drawer-shop')
    console.log('+++++++ ---', logged, shopEle)
    if (shopEle && shopEle.href) {
        // 在我的主页，保存店铺url
        store.shopUrl = shopEle.href
            // 跳转到新商品发布页，获取csx-token和cookie
        location.href = 'https://fril.jp/item/new'
        require('electron').remote.getCurrentWebContents().session.cookies.get({}).then(cookies => {
            ipcRenderer.send('login-success', shopEle.href, cookies)
        })
        return
    }
    console.log('登陆状态', logged)
    if (logged) {
        setTimeout(() => {
            // 跳转到我的主页，触发本文件内代码在我的主页再次执行
            location.href = 'https://fril.jp/mypage'
                //getShopId()
        }, 0);
    }
})

// timer = setInterval(() => {
//     console.log('检查是否登陆')
//     const logged = document.querySelector('.ga-loggedin')
//     const shopEle = document.querySelector('.ga-drawer-shop')
//     console.log('+++++++ ---', logged, shopEle)
//     if (shopEle && shopEle.href) {
//         clearInterval(timer)
//             // 跳转到我的主页，保存店铺url，cookies
//         require('electron').remote.getCurrentWebContents().session.cookies.get({}).then(cookies => {
//             ipcRenderer.send('login-success', shopEle.href,cookies)
//         })
//         return
//     }
//     console.log('登陆状态', logged)
//     if (logged) {
//         clearInterval(timer)
//         setTimeout(() => {
//             // 跳转到我的主页，触发本文件内代码在我的主页再次执行
//             location.href = 'https://fril.jp/mypage'
//                 //getShopId()
//         }, 0);
//     }
// }, 500);

// function getShopId() {
//     timer = setInterval(() => {
//         console.log('获取店铺id')
//         const shopEle = document.querySelector('.ga-drawer-shop')

//     }, 500);
// }