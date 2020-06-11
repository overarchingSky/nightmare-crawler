import Vue from 'vue'
import VueRouter from 'vue-router'
import CrawlerProd from '../views/crawler-prod.vue'
import RegularRelease from '../views/regular-release.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '商品抓取',
    component: CrawlerProd
  },
  {
    path: '/regular-release',
    name: '定时发布',
    component: RegularRelease
  }
]

const router = new VueRouter({
  routes
})

export default router
