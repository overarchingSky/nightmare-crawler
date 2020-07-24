<template>
  <div class="regular-release">
    <md-empty-state
      v-if="empty"
      md-icon="devices_other"
      md-label="Create your first task"
      md-description="empty">
    </md-empty-state>
    <md-list v-else>
      <md-subheader>请在下方启用/停用任务</md-subheader>

      <md-list-item @click="() => {}" v-for="task in list" :key="task.id">
        <md-icon>update</md-icon>
        <span class="md-list-item-text">{{task.taskName}}</span>
        <md-switch v-model="task.enable" :title="task.enable ? '停用' : '启用'" @click.stop />
        <md-button @click="handDeleteTask(task.id)">
          <md-icon>delete_sweep</md-icon>
        </md-button>
      </md-list-item>
    </md-list>
    <md-button class="md-primary md-raised" @click="openPanel">Create task</md-button>
      <md-dialog :md-active.sync="showCreateTaskPanel">
        <md-dialog-title>
          create task 2
          <md-button class="close" @click="showCreateTaskPanel = false">
            <md-icon>close</md-icon>
          </md-button>
        </md-dialog-title>
        <create-release-task-form ref="form" @on-add-task="load">
          <!-- <md-dialog-actions slot="action">
            <md-button class="md-primary" @click="showCreateTaskPanel = false">取消</md-button>
            <md-button class="md-primary" @click="createTask">保存</md-button>
          </md-dialog-actions> -->
        </create-release-task-form>        
        
      </md-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
const { ipcRenderer } = window.electron
import CreateReleaseTaskForm from '@/components/create-release-task-form.vue'

export default {
  name: 'regular-release',
  components: {
    CreateReleaseTaskForm
  },
  data(){
    return {
      showCreateTaskPanel:false,
      list:[]
    }
  },
  computed:{
    empty(){
      return this.list.length === 0
    }
  },
  // watch:{
  //   'task.enable'(val){
  //     if(val){
  //       //开启任务
  //       switch(task.type){
  //         case taskType['弹性间隔']:
  //           cosnt [min,max] = task.intervalSection
  //           const interval = min + Math.random() * (max - min)
  //           //task中的时间是以分钟为单位，许哟乘以 60 * 1000转化为毫秒
  //           setInterVal(this.releaseProduct,task.interval * 60 * 1000)
  //           break;
  //         case taskType['固定间隔']:
  //           //task中的时间是以分钟为单位，许哟乘以 60 * 1000转化为毫秒
  //           setInterVal(this.releaseProduct,task.interval * 60 * 1000)
  //           break;
  //       }
  //     }else{
  //       //停止任务
  //     }
  //   }
  // },
  methods:{
    openPanel(){
      this.showCreateTaskPanel = true
    },
    createTask(){
      this.$refs.form.createTask().then(task => {
        this.list.push(task)
        this.showCreateTaskPanel = false
      })
    },
    load(tasks){
      this.list = tasks
    },
    handDeleteTask(id){
      console.log('删除任务', id)
      // 删除任务
    }
  },
  created(){
    ipcRenderer.on('saved-task',(e, tasks) => {
      console.log('tasks',tasks)
      // 关闭dialog
      this.showCreateTaskPanel = false
      // 刷新任务列表
      this.load(tasks)
    })
  }
}
</script>
<style lang="scss">
.md-dialog-container{
    width:650px;
    .close{
      position:absolute;
      top:14px;
      right:18px;
      min-width:auto;
    }
}
  
</style>
