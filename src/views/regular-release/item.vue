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
        this.getProducts().then(() => {
            if(this.task.immedation){
              this.releaseProduct()
            }
        })
        console.log('开启任务',this.task.name)
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
          products:null
      }
  },
  methods:{
    getProducts(){
        return new Promise((resolve,reject) => {
            //获取发布的商品明细列表
            if(!this.products || !Array.isArray(this.products)){
                ipcRenderer.send('get-product-list',this.task.id)
                ipcRenderer.on('ge-product-list-response',(e,products) => {
                    console.log('获取到商品信息',products)
                    this.products = products
                    resolve(this.products)
                })
            }
        })
        
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
                            cookies: store.cookie,
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