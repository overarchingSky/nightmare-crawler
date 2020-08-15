const { session, BrowserWindow, ipcMain } = require('electron')
const store = new(require('electron-store'))
const { cookiesKey } = require('../const')
const path = require('path')
let cookies = store.get(cookiesKey) || [];
const isEffect = cookies.length > 0
let isCookiesChanged = false;
console.log(store.path)
    // if (!isEffect) {
    //     // to login
    //     startLogin()
    // }
startLogin()

function startLogin() {
    let timer
        // 创建浏览器窗口
    const win = new BrowserWindow({
        width: 1600,
        height: 600,
        // 这个会导致某些接口容易调用失败
        webPreferences: {
            // 注入调用test.js检查是否登录成功
            preload: path.resolve(__dirname, './test.js')
                //nodeIntegration: true
        }
    })

    // 并且为你的应用加载index.html
    win.loadURL('https://fril.jp/users/sign_in')
        //win.loadURL('https://www.zhihu.com/people/dou-jiao-87-20')
        // 打开开发者工具
    win.webContents.openDevTools()

    ipcMain.on('login-success', () => {
        //登陆成功
    })
}


module.exports = cookies;