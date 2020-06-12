// 抓取商品列表
const Crawler = require('crawler')

var next

var p = new Promise((resolve,reject) => {

})

var c = new Crawler({
    rateLimit:500,
    proxy:'http://localhost:1080',
    preRequest(options, done){
        // 在发送请求之前做些事情
        // 这里发起登录流程，以获取cookie
        done()
    },
    // This will be called for each crawled page
    callback: function(err, res, done){
        console.log(res.$("title").text());
        // cheerio // 解析html，从中提取需要的内容
        $ = res.$

        done(res.body);
    }
});

function start(buildUrl,pageCount,cb){
    let page = 0
    while(pageCount--){
        page++
        url = buildUrl(page)
        c.queue({uri:url,callback(err, res, done){
                $ = res.$
                console.log(res)
                const data = [{name:'test', url:url}]
                done();
                cb(data, pageCount === 0)
            }
        })
    }
}

module.exports = start
