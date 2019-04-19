import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component:  resolve => require(['@/components/login'],resolve)
    },
    {
      path: '/index',
      name: 'index',
      component:  resolve => require(['@/components/index'],resolve),
      children:[
        
        {
          path:"/isystem/user",
          name: 'user',
          component:  resolve => require(['@/components/sysAdminister/staffAdminister'],resolve),
        },
        
      ]
    },
  ]
})
