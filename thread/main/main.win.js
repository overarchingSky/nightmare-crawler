const { BrowserWindow } = require('electron')
const path = require('path')
class MainWindow {
    win
    constructor() {
        console.log('++++++')
        this.win = new BrowserWindow({
            width: 1000,
            height: 600,
            webPreferences: {
                preload: path.resolve(__dirname, '../render/main.inject.js'),
                nodeIntegration: true
            }
        })
        process.env.NODE_ENV === 'production' ? this.win.loadFile(path.resolve(__dirname, '../dist/index.html')) : this.win.loadURL('http://localhost:8991')
            // 打开开发者工具
        this.win.webContents.openDevTools()
    }
}

module.exports = MainWindow