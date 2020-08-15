const { BrowserWindow } = require('electron')
class BackendWindow {
    win
    loginUrl = 'https://fril.jp/users/sign_in'
    constructor() {
        this.win = new BrowserWindow({
            width: 1000,
            height: 600,
            webPreferences: {
                preload: '../../thread/render/back.inject.js', //path.resolve(__dirname, './utils.js'),
                nodeIntegration: true
            }
        })
        this.win.loadURL(this.loginUrl)
        this.win.webContents.openDevTools()
        console.log('子窗口加载成功')
    }
}

module.exports = BackendWindow