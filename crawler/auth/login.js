const { session, BrowserWindow } = require('electron')
const store = new(require('electron-store'))
const sessionCookieStoreKey = 'cookies.firl.jp'
    // 获取到默认session，并查看其中是否存在cookie，或者cookie是否有效
    // const defaultSession = session.defaultSession
    // const cookies = defaultSession.cookies
    // const isEffect = Object.keys(cookies).length > 0
let cookies = store.get(sessionCookieStoreKey) || [];
const isEffect = false //cookies.length > 0
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
    win.loadURL('https://fril.jp/users/sign_in')
        //win.loadURL('https://www.zhihu.com/people/dou-jiao-87-20')
        // 打开开发者工具
    win.webContents.openDevTools()
    const cookies = win.webContents.session.cookies
    cookies.on('changed', (...e) => {
        // console.log('cookies changed')
        // console.log('fril.jp', e)

        // 保存cookies
        let isCookiesChanged = false;
        win.webContents.session.cookies.on('changed', () => {
            //检测cookies变动事件，标记cookies发生变化
            isCookiesChanged = true;
        });

        //每隔500毫秒检查是否有cookie变动，有变动则进行持久化
        setInterval(() => {
            if (!isCookiesChanged) {
                return;
            }
            win.webContents.session.cookies.get({})
                .then((cookies) => {
                    store.set(sessionCookieStoreKey, cookies);
                })
                .catch((error) => {
                    console.log({ error })
                })
                .finally(() => {
                    isCookiesChanged = false;
                })
        }, 500);
    })
    win.on("page-title-updated", () => {
        // 检查是否登陆
        console.log('webContents', win.webContents)
        win.webContents.executeJavaScript(`console.log('哈哈！');`)
            // https://fril.jp/mypage
    })
}


module.exports = cookie;