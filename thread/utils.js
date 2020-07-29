//检查是否登录成功，本文件是被注入到页面内的，每次跳转页面，都会重新注入一次，即每次页面切换，都会重新执行一次
const { ipcRenderer } = require('electron')
window.ipcRenderer = ipcRenderer

logged = false

/**
 * 检查是否登陆
 */
function checkLogin() {
    logged = !!document.querySelector('.ga-loggedin')
        // const shopEle = document.querySelector('.ga-drawer-shop')
        // if (shopEle && shopEle.href) {
        //     clearInterval(timer)
        //         // 跳转到我的主页，保存店铺url，cookies
        //     require('electron').remote.getCurrentWebContents().session.cookies.get({}).then(cookies => {
        //         ipcRenderer.send('login-success', shopEle.href,cookies)
        //     })
        //     return
        // }
    console.log('登陆状态', logged)
    if (logged) {
        ipcRenderer.send('login-success')
    }
    return logged
        // if (logged) {
        //     setTimeout(() => {
        //         // 跳转到我的主页，触发本文件内代码在我的主页再次执行
        //         location.href = 'https://fril.jp/mypage'
        //     }, 0);
        // }
}

/**
 * 获取店铺url
 */
function getStoreUrl() {
    const shopEle = document.querySelector('.ga-drawer-shop')
    ipcRenderer.send('update-storeUrl', shopEle.href)
}

timer = setInterval(() => {
    if (checkLogin()) {
        timer && clearTimeout(timer)
        getStoreUrl()
        timer = setInterval(() => {
            this
        })
    }
}, 500);

function getShopId() {
    timer = setInterval(() => {
        console.log('获取店铺id')
        const shopEle = document.querySelector('.ga-drawer-shop')

    }, 500);
}