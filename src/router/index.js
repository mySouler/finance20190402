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
          path:"SmartPurchasing",
          name: 'SmartPurchasing',
          component:  resolve => require(['@/components/sysAdminister/staffAdminister'],resolve),
        },
        {
          path:"Employee",
          name: 'Employee',
          component:  resolve => require(['@/components/sysAdminister/staffAdminister'],resolve),
        }
      ]
    },
  ]
})
