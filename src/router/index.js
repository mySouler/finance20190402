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

const grossfit = () => import('@/components/sendData/grossfit')//销售部门
const head = () => import('@/components/sendData/head')//头程配置表
const sellcost = () => import('@/components/sendData/sellcost')//销售人力成本配置
const warehouse = () => import('@/components/sendData/warehouse')//"仓库人力成本配置"
const express = () => import('@/components/sendData/express')//"运费为0的配置"
const totalincome = () => import('@/components/sendData/totalincome')//"总收入为0的配置"
const param = () => import('@/components/sendData/param')//"修正运费参数"
const jurisdiction = () => import('@/components/sendData/jurisdiction')//"发货数据下载权限配置"
const getgrossfit = () => import('@/components/sendData/getgrossfit')//""取毛利配置表的配置""

const api = () => import('@/components/apiTotal/api')//""api退款统计""


const upload = () => import('@/components/check/upload')//"核对数据上传"
const parseLog = () => import('@/components/check/parseLog')//"解析日志"
const download = () => import('@/components/dataTotal/download')//"发货数据下载"
const updfreight = () => import('@/components/dataTotal/updfreight')//"发货数据下载"














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
            department,
            grossfit,
            head,
            sellcost,
            warehouse,
            express,
            totalincome,
            param,
            jurisdiction,
            api,
            upload,
            parseLog,
            getgrossfit,
            download,
            updfreight,


          }
        }
      ]
    }

  ]
})
