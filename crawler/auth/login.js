const { session, BrowserWindow, ipcMain } = require('electron')
const store = new(require('electron-store'))
const { cookiesKey } = require('../const')
const path = require('path')
let cookies = store.get(cookiesKey) || [];
const isEffect = cookies.length > 0
let isCookiesChanged = false;
console.log(store.path)
if (!isEffect) {
    // to login
    startLogin()
}

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
        // cookies.on('changed', handleCookieChange)

    function handleCookieChange(...e) {
        // win.webContents.session.cookies.get({})
        //     .then((cookies) => {
        //         store.set(cookiesKey, cookies);
        //     })
        //     .catch((error) => {
        //         console.log({ error })
        //     })
        //     .finally(() => {
        //         isCookiesChanged = false;
        //     })
        // return
        //检测cookies变动事件，标记cookies发生变化
        isCookiesChanged = true;

        //每隔500毫秒检查是否有cookie变动，有变动则进行持久化
        timer = setInterval(() => {
            if (!win || !win.webContents) {
                clearInterval(timer)
                return
            }
            if (!isCookiesChanged) {
                return;
            }

            console.log('timer', timer)
            win.webContents.session.cookies.get({})
                .then((cookies) => {
                    store.set(cookiesKey, cookies);
                })
                .catch((error) => {
                    console.log({ error })
                })
                .finally(() => {
                    isCookiesChanged = false;
                })
        }, 500);
    }
    // win.on("page-title-updated", () => {
    //     // 检查是否登陆
    //     //cookies.removeListener('changed', handleCookieChange)
    //     win.webContents.executeJavaScript(`
    //         window.ipcRenderer.send('login-success')
    //     `)
    // })
    ipcMain.on('login-success', () => {

        setTimeout(() => {
            //win.destroy()
        }, 0);
    })
}


module.exports = cookies;