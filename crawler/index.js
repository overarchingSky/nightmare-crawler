const { app, BrowserWindow, ipcMain } = require('electron')
const recoveyCookies = require('./auth/recovey-cookies')
const getProd = require('./task/get-prod')
const path = require('path')
require('./menu')


function createWindow() {
    // 引入登陆模块，如果未登录，将会打开新窗口并访问登陆页
    const cookies = require('./auth/login')

    // 创建浏览器窗口
    const win = new BrowserWindow({
            width: 1000,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            }
        })
        // 恢复cookies现场
    recoveyCookies(win, cookies)

    // 加载应用程序主页
    win.loadFile(path.resolve(__dirname, '../dist/index.html'))

    // 打开开发者工具
    win.webContents.openDevTools()
}

// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(createWindow)

//当所有窗口都被关闭后退出
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// 您可以把应用程序其他的流程写在在此文件中

ipcMain.on('get-prod', (event, options) => {
    pageCount = 1
    getProd((page) => {
        return 'https://fril.jp/category/668/page/' + page
    }, pageCount, (data, finished) => {
        event.reply('revice-prod', data)
        if (finished) {
            event.reply('revice-prod-end')
        }
    })
})