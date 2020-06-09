const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })

//nightmare.goto('https://fanyi.baidu.com/?aldtype=16047#zh/en/%E7%88%AC%E8%99%AB%E7%A8%8B%E5%BA%8Fc')
nightmare
    .on('loaded', () => console.log('loaded!!!!'))
    .goto('file://' + __dirname + '/ui/index.html')
    .inject('js', './ui/index.js')
    .wait('.newbox')

.evaluate(() => {
        box = document.querySelector('.newbox')
        return box.innerText
    })
    .then((title) => {
        console.log(title);
    })
    .catch(err => {
        console.log(err)
    })
    //.end()


// .cookies.get()


// .cookies.get()
// .then((title) => {
//     console.log(title);
// })