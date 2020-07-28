const { app, dialog, BrowserWindow, ipcMain } = require('electron')
const store = new(require('electron-store'))
const { cookiesKey } = require('./const')
const recoveyCookies = require('./auth/recovey-cookies')
const getProd = require('./task/get-prod')
const path = require('path')
const child_process = require('child_process');
const fs = require('fs')
require('./menu')
const product = require('./product/index')
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
            "_ra": "1593332952428|23099db8-3a17-470e-9a72-8bce3dd5e074",
            "__gads": "ID=70088d27be40d614:T=1593332953:S=ALNI_MbuN15fTWskyScpKIMBl5V94LiUsw",
            "_gid": "GA1.2.1018829010.1594605295",
            "_ga": "GA1.2.1999933104.1593332952",
            "_fbp": "fb.1.1594610025071.236646165"
        }
        // 在node进程中调用python爬虫，要避免在python中进行log，即print，因为这些log会出现在node的控制台中，但是因为node默认编码和python不一致，所以会导致node执行异常，从而不能抓取到数据
        // 当然，也可以想办法调整node的encode，不过这里暂时没有研究
    const workerProcess = child_process.exec(`scrapy crawl fril -a cookies=${JSON.stringify(cookies)}`, {
            cwd: path.resolve(__dirname, './python-task')
        })
        // workerProcess.stdout.on('data',function(data){
        //     console.log(data)
        // })
    const filePath = path.resolve(__dirname, "./python-task/data-sheet/prod.json")
    fs.watchFile(filePath, function(curr, prev) {
        let f = fs.readFile(path.resolve(__dirname, "./python-task/data-sheet/prod.json"), "utf-8", function(err, data) {
            if (data && data.length > 0) {
                event.reply('revice-prod', JSON.parse(data))
                fs.unwatchFile(filePath)
            }
        })
    })
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

ipcMain.on('login-success', (e, shopUrl, cookies) => {
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
    event.reply('saved-task')
    event.reply('get-task', tasks)
})

ipcMain.on('get-task', (event) => {
    const tasks = store.get('task', [])
    event.reply('get-task', tasks)
})

ipcMain.on('delete-task', (event, id) => {
    const tasks = store.get('task', [])
    const index = tasks.findIndex(task => task.id === id)
    console.log('delete-task', index, id)
    index > -1 && tasks.splice(index, 1)
    store.set('task', tasks)
    event.reply('get-task', tasks)
})

ipcMain.on('start-task', async(event, id) => {
    const tasks = store.get('task', [])
    const task = tasks.find(task => task.id === id)
    const prods = await product.getDetails(undefined, id)
    product.release(prods)
        // event.reply('get-task', tasks)
})


// {"utf8": "✓", "_method": "patch", "authenticity_token": "jrejYWzyrF3dmo8KY9x574naGjVbJHKy1WpUKesOm44DxsfkJZBNfhWmKGEao5tztoC21VXPt+cxLN91adVduw==", "item_img_ids": ["951298869", "951298876", "951298888", "951298893"], "updates": [], "set_images": [], "crop_x": [], "crop_y": [], "crop_size": [], "item": {"user_id": 12057135, "name": "安定性高い磁石タイプ　ドア カーテシ カーテシー ライト ランプ　2個　385", "detail": "商品No.385\r\n\r\n※車のドアを開けるとロゴが足元を照らします\r\n\r\n※一般的な外に開くタイプのドアなら取り付け可能\r\n\r\n他にもデザインあります↓↓↓\r\n#ほかにも色々出品していますぜひご覧ください\r\n\r\n★訳あり\r\n新品未使用ですが、インポート商品のため、4枚目の画像通り、ランプ本体にキズがあり、ご理解できる方のみお願いします\r\n\r\n★商品説明\r\n※安定性が高い磁石タイプです\r\n※高品質LEDでキレイなロゴが投影されます\r\n※配線加工など一切要りません\r\n※付属の磁石センサーで開閉時、自動ON-OFF\r\n※又はスイッチでON、OFF切り替え可能\r\n※ 2分で自動消灯の安全機能付き\r\n※電源：単4電池 3本（別途必要） \r\n※付属の両面テープで取付けが出来ます\r\n（接着前に接着面の汚れ等落としてください付が悪くなります）特にレザーワックスなどは付が悪くなりますので落としてください\r\n\r\n★取付け手順\r\n①ドアランプの裏ブタを外し、電池（単4×3本）を入れ \r\n②ランプをロゴが地面に映る方向に、両面テープにてドア下部に取付\r\n③その真下（閉めた状態でセンサーの当たる場所）に付属の磁石を設置\r\n④ドアを開けLEDが点灯、閉めた時消灯すれば取付け完了\r\n\r\n★検品\r\n発送する前に、必ず検品を行いますので、ご安心ください\r\n\r\n★発送   \r\nゆうゆうラクマ便で発送します\r\n※ ロゴフィルムのみ購入した場合、普通郵便で発送します\r\n\r\n★梱包\r\nOPP袋に入れ、プチプチで包み、専用の箱で発送します\r\n※ロゴフィルムのみ購入した場合、OPPとプチプチで包み、封筒で発送します\r\n \r\n★注意事項\r\n1.センサーの仕事範囲は約1~2ｃｍ、付属の磁鉄をちょうどいい場所に貼らないと当商品は役に立たないと存じます\r\n\r\n2.取り付けの前に設置部の汚れを十分拭き取り、乾燥させて下さい\r\n\r\n3.説明書はありません\r\n\r\n4.お値下げは出来ませんm(._.)m\r\n\r\n\r\nLED 取り付け簡単 配線不要 ドアカーテシランプ ドア ウェルカムライト ドアウェルカムライト カーテシランプ レーザーロゴライト 車 改造 ドアライト ドアランプ カーテシ カーテシランプ カーテシーランプ プロジェクターライト LEDカーテシライト カーテシーライト カーテシー カーテシランプ カーテシーランプ カー用品", "parent_category_id": 1135, "category_id": 1143, "size_id": 19999, "brand_id": null, "informal_brand_id": null, "status": 5, "origin_price": 1800, "sell_price": 1800, "transaction_status": 0, "carriage": 1, "delivery_method": 9, "delivery_date": 1, "delivery_area": 23, "open_flag": 1, "sold_out_flag": 0, "related_size_group_ids": [], "request_required": "0"}}