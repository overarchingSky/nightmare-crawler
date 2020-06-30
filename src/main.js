import Vue from 'vue'
import './Vue Material'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
import store from './store'
import './validate'
import './styles/index.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
