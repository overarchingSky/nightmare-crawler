<template>
  <div class="regular-release">
    <md-empty-state
      v-if="empty"
      md-icon="devices_other"
      md-label="Create your first task"
      md-description="empty">
    </md-empty-state>
        
    <template v-else>
        <md-subheader>请在下方启用/停用任务</md-subheader>
        <list :list="list"></list>
    </template>
    
    <md-button class="md-primary md-raised" @click="openPanel">Create task</md-button>
      <md-dialog :md-active.sync="showCreateTaskPanel">
        <md-dialog-title>
          create task
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
import List from './list'

export default {
  name: 'regular-release',
  components: {
    List,
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
        if(tasks){
            this.list = tasks
            return
        }
        
        ipcRenderer.send('get-task')
    }
  },
  created(){
    this.load()
    ipcRenderer.on('saved-task',(e, tasks) => {
      console.log('tasks',tasks)
      // 关闭dialog
      this.showCreateTaskPanel = false
      // 刷新任务列表
      //this.load(tasks)
    })
    ipcRenderer.on('get-task',(e,tasks) => {
            console.log('load',tasks)
            this.list = tasks
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
