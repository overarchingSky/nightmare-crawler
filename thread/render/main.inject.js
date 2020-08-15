const remote = require('electron').remote
const store = remote.getGlobal('store')
store.event.add('main', remote.getCurrentWindow())
console.log('main-store', store)
    // import event from '../event-bus.js'
    // const mainWin = remote.getCurrentWindow()
    // const product = require('./product/index')
    // const store = new(require('electron-store'))

//event.add('main', remote.getCurrentWindow())


// export default {
//     release(id) {
//         console.log('release')
//         const win = event.wins['back']
//         const loaded = 'LOADED'
//             // const js = fs.readFileSync(path.resolve(__dirname,''))
//         mainWin.once(loaded, async(token, cookie) => {
//             // const tasks = store.get('task', [])
//             // const task = tasks.find(task => task.id === id)
//             const prods = await product.getDetails(undefined, id)
//             product.release(prods)
//         })
//         win.webContents.executeJavaScript(`
//             const event = require('../event-bus.js')
//             const { remote } = require('electron')
//             window.addEventListener('load',() => {
//                 //获取authenticity_token
//                 let authenticity_token = document.querySelector('')
//                 event.wins['main'].dispatch('${loaded}', authenticity_token, document.cookie)
//             })
//         `)
//         win.loadUrl('发布商品的页面url')

//     }
// }