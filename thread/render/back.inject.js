// 作为额外的脚本注入到子窗口中
// 窗口中的每次页面重载，跳转等，都会重新执行本脚本
const remote = window.electron.remote
const store = remote.getGlobal('store')
store.event.add('back', remote.getCurrentWindow())

const releaseUrl = 'https://fril.jp/item/new'

store.event.on('release-product', 'back', () => {
    // 跳转到新商品发布页，获取csx-token和cookie
    location.href = releaseUrl
})

function checkLogined() {
    const logged = document.querySelector('.ga-loggedin')
    if (logged) {
        setTimeout(() => {
            location.href = 'https://fril.jp/mypage'
        }, 0);
    }
}

function getShowUrl() {
    const shopEle = document.querySelector('.ga-drawer-shop')
    if (shopEle && shopEle.href) {
        // 在我的主页，保存店铺url
        store.shopUrl = shopEle.href
            // require('electron').remote.getCurrentWebContents().session.cookies.get({}).then(cookies => {
            //     ipcRenderer.send('login-success', shopEle.href, cookies)
            // })
            // return
    }
}

// 在子窗口中注入本脚本，用来获取authenticity_token和cookie
// 获取成功后，通过事件总线，抛出release-product-ready事件
function getCookieAndAuthenticityToken() {
    let meta = document.querySelector('meta[name="csrf-token"]')
    console.log('meta', meta)
    let authenticity_token = meta && meta.content
    console.log('authenticity_token', authenticity_token)
    store.authenticity_token = authenticity_token
    store.cookie = document.cookie
    store.dispatch('release-product-ready', 'main', store)
}



window.addEventListener('load', () => {
    if (location.href === releaseUrl) {
        getCookieAndAuthenticityToken
    } else {
        checkLogined()
        getShowUrl()
    }
})