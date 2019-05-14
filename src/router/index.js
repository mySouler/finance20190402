import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 路由按模块划分懒加载 

const login = () => import('@/components/login')//登录
const index = () => import('@/components/index')//index
const home = () => import('@/components/home')//home
const user = () => import('@/components/system/staffAdminister')//员工管理
const depart = () => import('@/components/system/department')//部门管理
const role = () => import('@/components/system/userRole')//角色管理
const permission = () => import('@/components/system/menuList')//菜单管理

//基础数据配置  

const catalogue = () => import('@/components/base/catalogue')//分类平台费配置
const paymentTool = () => import('@/components/base/paymentTool')//收款工具配置
const rate = () => import('@/components/base/rate')//财务汇率配置 
const ratePredict = () => import('@/components/base/ratePredict')//财务汇率预修改 
const rateLog = () => import('@/components/base/rateLog')//财务日志

const paymentAccount = () => import('@/components/base/paymentAccount')//收款账号 
const shopgroup = () => import('@/components/base/shopgroup')//店铺组别配置
const shop = () => import('@/components/base/shop')//店铺组别配置

const platform = () => import('@/components/base/platform')//平台
const department = () => import('@/components/base/department')//销售部门








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
            shopgroup,
            shop,
            catalogue,
            paymentTool,
            rate,
            rateLog,
            ratePredict,
            paymentAccount,
            platform,
            department
          }
        }
      ]
    }
   
  ]
})
