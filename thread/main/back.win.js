// if (typeof module === 'object') {
//     window.module = module;
//     module = undefined;
// }
const { BrowserWindow } = require('electron')
const path = require('path')
class BackendWindow {
    win
    loginUrl = 'https://fril.jp/users/sign_in'
    constructor() {
        this.win = new BrowserWindow({
            width: 1000,
            height: 600,
            webPreferences: {
                enableRemoteModule: true,
                preload: path.resolve(__dirname, '../render/back.inject.js'), //path.resolve(__dirname, './utils.js'),
                nodeIntegration: false
            }
        })
        this.win.loadURL(this.loginUrl)
        this.win.webContents.openDevTools()
        console.log('子窗口加载成功')
    }
}

module.exports = BackendWindow