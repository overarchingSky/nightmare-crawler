<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <!-- <md-app-toolbar class="md-primary">
        <span class="md-title">My Title</span>
      </md-app-toolbar> -->
      <md-app-content>
        <!-- prod table -->
        <md-table v-model="list" md-sort="name" md-sort-order="asc" md-fixed-header>
          <!-- <md-table-toolbar>
            <div class="md-toolbar-section-start">
              <h1 class="md-title">Users</h1>
            </div>

            <md-field md-clearable class="md-toolbar-section-end">
              <md-input placeholder="Search by name..." v-model="search" @input="searchOnTable" />
            </md-field>
          </md-table-toolbar> -->

          <md-table-empty-state
            md-label="暂无数据"
            md-description="请在右侧填写参数，并点击查询">
            <!-- <md-button class="md-primary md-raised" @click="newUser">Create New User</md-button> -->
          </md-table-empty-state>

          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
            <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
            <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
            <md-table-cell md-label="Gender" md-sort-by="gender">{{ item.gender }}</md-table-cell>
            <md-table-cell md-label="Job Title" md-sort-by="title">{{ item.title }}</md-table-cell>
          </md-table-row>
        </md-table>
      </md-app-content>
      <!-- config -->
      <md-app-drawer md-permanent="full" :md-right="true">
        <md-list>
          <md-list-item>
            <!-- <md-icon>move_to_inbox</md-icon> -->
            <span class="md-list-item-text" @click="getProd">开始爬取</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      
    </md-app>
  </div>
</template>
<script>
const { ipcRenderer } = window.electron
export default {
  data(){
    return {
      loading:false,
      list:[]
    }
  },
  methods:{
    getProd(){
      console.log('爬取中...')
      this.loading = true
      ipcRenderer.send('get-prod',{})
    },
    fullData(data){
      this.list.push(data)
    },
    endLoad(){
      this.loading = false
    }
  },
  created(){
    ipcRenderer.on('revice-prod',this.fullData)
    ipcRenderer.on('revice-prod-end',this.endLoad)
  }
}
</script>
<style lang="scss" scoped>
  .md-app {
    height:100%;
    //max-height: 400px;
    border: 1px solid rgba(#000, .12);
  }

   // Demo purposes only
  .md-drawer {
    width: 250px;
    //max-width: calc(100vw - 125px);
  }
</style>