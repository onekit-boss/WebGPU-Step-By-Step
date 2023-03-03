import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import index from '@/index.vue'
Vue.config.productionTip = false

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: index,
    children:[]
  }
]
function loadPage(i){
  var page = i.toString();
  if (page.length < 2) {
    page = `0${page}`
  }
 return {
      path: `/${page}`,
      component: ()=>import(`@/${page}/index.vue`),
    }
}
for (var i = 0; i <= 51; i++) {
  routes[0].children.push(loadPage(i))
  
}
const router = new VueRouter({
  mode: 'history',
  routes
})
new Vue({
  el:"#app",
  template:'<App/>',
  router,
  componnets:{App},
  render: h => h(App)
}).$mount('#app')
