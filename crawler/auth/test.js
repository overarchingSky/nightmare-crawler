const { ipcRenderer } = require('electron')
window.ipcRenderer = ipcRenderer

timer = setInterval(() => {
    console.log('检查是否登陆')
    const logged = document.querySelector('.ga-loggedin')
    const shopEle = document.querySelector('.ga-drawer-shop')
    console.log('+++++++ ---', logged, shopEle)
    if (shopEle && shopEle.href) {
        clearInterval(timer)
            // 跳转到我的主页
        ipcRenderer.send('login-success', shopEle.href)
        return
    }
    console.log('登陆状态', logged)
    if (logged) {
        clearInterval(timer)
        setTimeout(() => {
            // 跳转到我的主页
            location.href = 'https://fril.jp/mypage'
                //getShopId()
        }, 0);
    }
}, 500);

function getShopId() {
    timer = setInterval(() => {
        console.log('获取店铺id')
        const shopEle = document.querySelector('.ga-drawer-shop')

    }, 500);
}