<template>
  <div class="regular-release">
    <md-empty-state
      v-if="empty"
      md-icon="devices_other"
      md-label="Create your first task"
      md-description="empty">
    </md-empty-state>
    <md-list v-else>
      <md-subheader>Settings</md-subheader>

      <md-list-item>
        <md-icon>network_wifi</md-icon>
        <span class="md-list-item-text">WiFi</span>
        <md-switch v-model="settings.wifi" />
      </md-list-item>

      <md-list-item>
        <md-icon>bluetooth</md-icon>
        <span class="md-list-item-text">Bluetooth</span>
        <md-switch v-model="settings.bluetooth" />
      </md-list-item>

      <md-list-item>
        <md-icon>data_usage</md-icon>
        <span class="md-list-item-text">Data Usage</span>
      </md-list-item>
    </md-list>
    <md-button class="md-primary md-raised" @click="openPanel">Create task</md-button>
      <md-dialog :md-active.sync="showCreateTaskPanel">
        <md-dialog-title>create task</md-dialog-title>
        <create-release-task-form ref="form">
          <md-dialog-actions slot="action">
            <md-button class="md-primary" @click="showCreateTaskPanel = false">取消</md-button>
            <md-button class="md-primary" @click="createTask">保存</md-button>
          </md-dialog-actions>  
        </create-release-task-form>        
        
      </md-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
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
  methods:{
    openPanel(){
      this.showCreateTaskPanel = true
    },
    createTask(){
      this.$refs.form.createTask().then(task => {
        this.list.push(task)
        this.showCreateTaskPanel = false
      })
    }
  }
}
</script>
<style lang="scss">
.md-dialog-container{
    width:650px;
}
  
</style>
