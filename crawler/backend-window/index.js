class BackendWindow {
    win
    loginUrl
    constractor() {
        this.win = new BrowserWindow({
            width: 400,
            height: 300,
            webPreferences: {
                preload: path.resolve(__dirname, './utils.js'),
                nodeIntegration: true
            }
        })
        this.win.loadUrl()
    }
}

module.exports = {
    openWindow() {

    }
}