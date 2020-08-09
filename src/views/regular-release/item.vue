<template>
    <md-list-item class="regular-release-list-item">
        <md-icon>update</md-icon>
        <span class="md-list-item-text">{{task.taskName}}</span>
        <md-checkbox v-model="task.immedation" class="md-primary immedation">启用时发布一次</md-checkbox>
        <md-switch v-model="task.enable" :title="task.enable ? '停用' : '启用'" @click.stop />
        <md-button @click="handDeleteTask(task.id)">
            <md-icon>delete_sweep</md-icon>
        </md-button>
    </md-list-item>
</template>

<script>
const { ipcRenderer,remote, event } = window.electron
import { taskType } from '@enums/task-type'
const mainT = require('../../../thread/render/main.win.js')
const mainWin = remote.getCurrentWindow()
console.log('mainT',mainT)
export default {
    name:'regular-release-list-item',
    props:{
        task:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    watch:{
    'task.enable'(val){
      if(val){
        //开启任务
        console.log('开启任务',this.task.name)
        if(this.task.immedation){
            this.releaseProduct()
        }
        let interval
        switch(this.task.type){
          case taskType['弹性间隔']:
            cosnt [min,max] = this.task.intervalSection
            interval = min + Math.random() * (max - min)
            break;
          case taskType['固定间隔']:
            interval = this.task.interval
            break;
        }
        //task中的时间是以分钟为单位，许哟乘以 60 * 1000转化为毫秒
        this.task.timer = setInterval(this.releaseProduct,interval * 60 * 1000)
      }else{
        //停止任务
        this.task.timer && clearInterval(this.task.timer)
      }
    }
  },
  methods:{
    getTokenAndCookie(){
      // 
      const hasCookieAndToken = !!window.authenticity_token
      if(hasCookieAndToken){
        this.releaseProduct(products)
        return
      }
      const loaded = 'LOADED'
      const backWin = event.wins['back']
      mainWin.once(loaded, async(token, cookie) => {
            // const tasks = store.get('task', [])
            // const task = tasks.find(task => task.id === id)
            document.cookie = cookie
            window.authenticity_token = token
            // 获取发布的商品明细列表
            ipcRenderer.send('get-product-list',this.task.id)
            ipcRenderer.once('ge-product-list-response',products => {
                this.releaseProduct(products)
            })
            // const prods = await product.getDetails(undefined, id)
            // product.release(prods)
      })
      backWin.webContents.executeJavaScript(`
            const event = require('../event-bus.js')
            const { remote } = require('electron')
            window.addEventListener('load',() => {
                //获取authenticity_token
                let authenticity_token = document.querySelector('')
                event.wins['main'].dispatch('${loaded}', authenticity_token, document.cookie)
            })
        `)
    },
    releaseProduct(products){
        console.log('定时任务',this.task.taskName)
        // const mainT = require('../thread/render/main.win.js')
        console.log('products',products)
        products = _.castArray(products)
        products = [products[0]]
        products.forEach(product => {
                product.item.name = 'refreshd:' + product.item.name
                    //console.log(product)
                data = qs.stringify(product, { arrayFormat: 'brackets', encode: false }).split('&').map(item => item.split('='))
                    //data = qs.stringify(product, { arrayFormat: 'brackets' })
                    //console.log(data)
                const f = new FormData()
                data.forEach(([key, val]) => {
                        if (key === 'authenticity_token') {
                            val = window.authenticity_token //'pekt/eH1FzhSCLJyl5tg+hBJd5xEYc9idWQ5akPn8pkd7nZXEjUqQCgU2AvjpKvGo25X82xlI2ItHjuozD88uA=='
                        }

                        f.append(key, val)
                    })
                    // console.log(f)
                    // authenticity_token和cookies具有一定的关联，firl校验了其有效性
            try{
                axios({
                        url: 'https://fril.jp/item/validate',
                        method: 'post',
                        data: f,
                        headers: {
                            cookies: document.cookie,
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
                            'x-requested-with': 'XMLHttpRequest'
                        }
                    }).then(res => {
                        console.log('success')
                        console.log(res)
                    })
                    .catch(error => {
                        console.log('error')
                        console.log(error)
                    })
            } catch (error) {
                console.log('catch error')
                console.log(error)
            }

        })
        //ipcRenderer.send('start-task',this.task.id)
    },
    handDeleteTask(id){
        console.log('删除任务', id)
        this.task.enable = false
        // 删除任务
        ipcRenderer.send('delete-task',id)
    }
  }
}
</script>

<style lang="scss">
.regular-release-list-item{
    .immedation{
        margin-right:16px;
    }
}

</style>