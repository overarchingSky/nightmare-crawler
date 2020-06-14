const { session, BrowserWindow } = require('electron')
    // 获取到默认session，并查看其中是否存在cookie，或者cookie是否有效
const defaultSession = session.defaultSession
const cookies = defaultSession.cookies
const isEffect = Object.keys(cookies).length > 0
console.log('cookies', Object.keys(cookies))
if (!isEffect) {
    // to login
    startLogin()
}

function startLogin() {
    // 创建浏览器窗口
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        // 这个会导致某些接口容易调用失败
        // webPreferences: {
        //     nodeIntegration: true
        // }
    })

    // 并且为你的应用加载index.html
    // win.loadURL('https://fril.jp')
    win.loadURL('https://www.zhihu.com/people/dou-jiao-87-20')
        // 打开开发者工具
    win.webContents.openDevTools()
    const cookies = win.webContents.session.cookies
    cookies.on('changed', (...e) => {
        console.log('cookies changed')
        console.log('fril.jp', e[1])
    })
}


module.export = function checkLogin() {

}