<template>
  <div id="app">
    <md-tabs>
      <md-tab id="defaults" md-label="商品抓取"  @click="to('/')" exact></md-tab>
       <md-tab id="regular-releas" md-label="定时发布" exact @click="to('/regular-release')"></md-tab>
    </md-tabs>
    <router-view />
  </div>
</template>
<script>
export default {
  methods:{
    to(path){
      this.$router.push(path)
    }
  }
}
</script>
<style lang="scss">
#app {
  height:100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display:flex;
  flex-direction: column;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.page-container{
  flex:1;
}
.md-app-content{
  padding:0;
}
</style>
