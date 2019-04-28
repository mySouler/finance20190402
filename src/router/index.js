import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 路由按模块划分懒加载 

const login = () => import('@/components/login')//登录
const index = () => import('@/components/index')//index
const home = () => import('@/components/home')//home
const user = () => import('@/components/system/staffAdminister')//员工管理
const depart = () => import('@/components/system/department')//部门管理
const role = () => import('@/components/system/userRole')//部门管理
const permission = () => import('@/components/system/menuList')//菜单管理




export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component:  login
    },
    {
      path: '/index',
      component:index,
      children: [
        {
          path:"",
          components: {
            home,
            user,
            depart,
            role,
            permission,
          }
        }
      ]
    }
   
  ]
})
