<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-content>
        <md-table class="table" v-model="list" md-sort="name" md-sort-order="asc" md-fixed-header>
          <md-table-empty-state
            md-label="暂无数据"
            md-description="请在右侧填写参数，并点击查询">
          </md-table-empty-state>

          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="name" md-sort-by="name">{{ item.name }}</md-table-cell>
            <md-table-cell md-label="picture" md-sort-by="img">
              <img :src="item.img" alt="" style="min-width:100px;height:100px;" srcset="">
            </md-table-cell>
            <md-table-cell md-label="url" md-sort-by="url">{{ item.url }}</md-table-cell>
            <md-table-cell md-label="desc" md-sort-by="desc">{{ item.desc }}</md-table-cell>
          </md-table-row>
        </md-table>
      </md-app-content>
      <!-- config -->
      <md-app-drawer md-permanent="full" :md-right="true">
        <md-list>
          <md-list-item>
            <span class="md-list-item-text" @click="getProd">开始爬取</span>
          </md-list-item>
          <md-list-item>
            <span class="md-list-item-text" @click="viewDoc">查看文件</span>
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
    viewDoc(){
      console.log('查看文件...')
      ipcRenderer.send('view-doc')
    },
    fullData(e,data){
      this.list.push(...data.map(item => item.item))
      console.log(this.list)
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
<style lang="scss">
  .md-app {
    height:100%;
    //max-height: 400px;
    border: 1px solid rgba(#000, .12);
  }
  .table,
  .md-table-content{
    width:100%
  }
   // Demo purposes only
  .md-drawer {
    width: 250px;
    //max-width: calc(100vw - 125px);
  }
  .md-table-cell-container{
    padding:6px 22px 6px 14px;
  }
</style>