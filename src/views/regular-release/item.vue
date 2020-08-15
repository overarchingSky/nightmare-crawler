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
const { ipcRenderer,remote } = window.electron
import { taskType } from '@enums/task-type'
const mainWin = remote.getCurrentWindow()
const store = remote.getGlobal('store')
console.log('store',store)
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
            this.getTokenAndCookie()
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
        this.task.timer = setInterval(this.getTokenAndCookie,interval * 60 * 1000)
      }else{
        //停止任务
        this.task.timer && clearInterval(this.task.timer)
      }
    }
  },
  data(){
      return {
          // 当前任务所控制的商品列表（发布，或者停止发布）
          products:[]
      }
  },
  methods:{
    getTokenAndCookie(){
      // 
      const hasCookieAndToken = !!window.authenticity_token
      if(hasCookieAndToken){
        this.releaseProduct()
        return
      }
      const loaded = 'LOADED'
      console.log('event +++',store.event)
      const backWin = store.event.wins['back']

      //获取authenticity_token和cookie原理
      //创建主子两个窗口，在子窗口中，进行访问目标页面，并进行登陆
      //然后通过注入子窗口脚本，在脚本内获取了目标页面的authenticity_token和cookie，然后通过事件总线将其抛出，通知所有订阅者（这里订阅者为主窗口）

      //订阅：主窗口监听名为loaded变量的值的事件，从而获取到需要的authenticity_token和cookie
      mainWin.once(loaded, async(token, cookie) => {
            // const tasks = store.get('task', [])
            // const task = tasks.find(task => task.id === id)
            document.cookie = cookie
            window.authenticity_token = token
            // 获取发布的商品明细列表
            ipcRenderer.send('get-product-list',this.task.id)
            ipcRenderer.once('ge-product-list-response',products => {
                this.products = products
                this.releaseProduct(products)
            })
            // const prods = await product.getDetails(undefined, id)
            // product.release(prods)
      })
      // step - 1
      // 在子窗口中注入脚本，用来获取authenticity_token和cookie
      // 获取成功后，通过事件总线，抛出名为loaded变量的值的事件
    //   backWin.webContents.executeJavaScript(`
    //         const event = require('../event-bus.js')
    //         const { remote } = require('electron')
    //         window.addEventListener('load',() => {
    //             //获取authenticity_token
    //             let meta = document.querySelector('meta[name="csrf-token"]')
    //             console.log('meta',meta)
    //             let authenticity_token = meta && meta.content
    //             console.log('authenticity_token',authenticity_token)
    //             const store = remote.getGlobal('store')
    //             store.authenticity_token = authenticity_token
    //             store.cookie = document.cookie
                
    //         })
    //     `)
        //event.wins['main'].dispatch('${loaded}', authenticity_token, document.cookie)
    },
    releaseProduct(){
        console.log('定时任务',this.task.taskName)
        console.log('products',this.products)
        let products = _.castArray(this.products)
        console.log('products',products)
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