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
const { ipcRenderer } = window.electron
import { taskType } from '@enums/task-type'
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
    releaseProduct(){
        console.log('定时任务',this.task.taskName)
        ipcRenderer.send('start-task',this.task.id)
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