const { app, dialog, BrowserWindow, ipcMain } = require('electron')
const store = new(require('electron-store'))
const { cookiesKey } = require('./const')
const recoveyCookies = require('./auth/recovey-cookies')
const getProd = require('./task/get-prod')
const path = require('path')
const child_process = require('child_process');
const fs = require('fs')
require('./menu')

console.log('-----', app.getPath('userData'))

//应用程序主界面
let win

function createWindow() {
    // 引入登陆模块，如果未登录，将会打开新窗口并访问登陆页
    const cookies = require('./auth/login')

    // 创建浏览器窗口
    win = new BrowserWindow({
            width: 1000,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            }
        })
        // 恢复cookies现场
    recoveyCookies(win, cookies)

    // 加载应用程序主页
    console.log('env', process.env.NODE_ENV)
    process.env.NODE_ENV === 'production' ? win.loadFile(path.resolve(__dirname, '../dist/index.html')) : win.loadURL('http://localhost:8991')

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
    let cookies = {
            "_ra":"1593332952428|23099db8-3a17-470e-9a72-8bce3dd5e074",
            "__gads":"ID=70088d27be40d614:T=1593332953:S=ALNI_MbuN15fTWskyScpKIMBl5V94LiUsw",
            "_gid":"GA1.2.1018829010.1594605295",
            "_ga":"GA1.2.1999933104.1593332952",
            "_fbp":"fb.1.1594610025071.236646165"
        }
    //store.get(cookiesKey) || [];
    console.log('get-prod',path.resolve(__dirname, './python-task'))
    //child_process.exec(`scrapy crawl fril -a cookies=${JSON.stringify({'aaa':'10'})}`, {
        const workerProcess = child_process.exec(`scrapy crawl fril -a cookies=${JSON.stringify(cookies)}`, {
        //child_process.exec(`scrapy crawl fril`, {
            cwd: path.resolve(__dirname, './python-task')
        }, (err, response, ss) => {
                // console.log(response)
                // if (Array.isArray(response)) {
                //     event.reply('revice-prod', response)
                // }
            
        })
        // workerProcess.stdout.on('data',function(data){
        //     console.log(data)
        // })
        const filePath = path.resolve(__dirname, "./python-task/data-sheet/prod.json")
        fs.watchFile(filePath,function(curr, prev){
            let f = fs.readFile(path.resolve(__dirname, "./python-task/data-sheet/prod.json"), "utf-8", function(err, data) {
                if(data.length > 0){
                    event.reply('revice-prod', JSON.parse(data))
                    fs.unwatchFile(filePath)
                }
            })
        })
        // pageCount = 1
        // const shapUrl = 'https://fril.jp/category/668' //store.get('shopUrl')
        // getProd((page) => {
        //     return `${shapUrl}/page/${page}`
        // }, pageCount, (data, finished) => {
        //     event.reply('revice-prod', data)
        //     if (finished) {
        //         event.reply('revice-prod-end')
        //     }
        // })
})




ipcMain.on('view-doc', () => {
    console.log('path', path.resolve(__dirname, 'python-task/data-sheet'))
    dialog.showOpenDialog({
        //title:'test'
        defaultPath: path.resolve(__dirname, 'python-task/data-sheet'),
        properties: ['openFile'],
        filters: [
            { name: 'All Files', extensions: ['csv', 'json'] }
        ]
    }).then(file => {
        console.log('选择文件：')
        console.log(file)
    })
})

ipcMain.on('login-success', (e, shopUrl,cookies) => {
    console.log('login success', shopUrl)
    store.set('shopUrl', shopUrl)
    //登陆成功，执行注入cookies逻辑
    store.set(cookiesKey, cookies)
    recoveyCookies(win, cookies)
})

ipcMain.on('save-task', (event, task) => {
    const tasks = store.get('task', [])
    console.log(tasks)
    tasks.push(task)
    store.set('task', tasks)
    console.log('tasks node', tasks)
    event.reply('saved-task', tasks)
})

ipcMain.on('get-task', (event) => {
    const tasks = store.get('task', [])
    event.reply('get-task', tasks)
})