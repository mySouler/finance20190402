// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui';
import store from './vuex'
import 'element-ui/lib/theme-chalk/index.css';
import '../static/css/base.css'
import 'babel-polyfill'
import axios from 'axios'
import App from './App'
import Qs from 'qs'
import {Message } from 'element-ui'





/*-----------------axios基本配置-----------*/


axios.defaults.baseURL = 'http://192.168.16.54:8088/hz-finance';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken;
let removePending = (config) => {
  for(let p in pending){
    if(pending[p].u === config.url + '&' + config.method) { //当当前请求在数组中存在时执行函数体
      pending[p].f(); //执行取消操作
      pending.splice(p, 1); //把这条记录从数组中移除
    }
  }
}

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  removePending(config); 
  let token = sessionStorage.getItem('token')
  if (token) {
    config.headers['X-Access-Token'] = token
  }

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 响应
axios.interceptors.response.use(function (response) {
  removePending(response.config); 
  const data = response.data;

  return data

}, function (err) {
  // 对响应错误做点什么
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        Message.error('code:'+err.response.status+',请求错误')
        break

      case 401:
        Message.error('code:'+err.response.status+',未授权，请登录')
        setTimeout(function () {
          router.push('/')
        },1500)
        break

      case 403:
        Message.error('code:'+err.response.status+',拒绝访问')
        break

      case 404:
        Message.error('code:'+err.response.status+',请求地址出错: ${err.response.config.url}')
        break

      case 408:
        Message.error('code:'+err.response.status+',请求超时')
        break

      case 500:
        Message.error('code:'+err.response.status+',服务器内部错误')
        break

      case 501:
        Message.error('code:'+err.response.status+',服务未实现')
        break

      case 502:
        Message.error('code:'+err.response.status+',网关错误')
        break

      case 503:
        Message.error('code:'+err.response.status+',服务不可用')
        break

      case 504:
        Message.error('code:'+err.response.status+',网关超时')
        break

      case 505:
        Message.error('code:'+err.response.status+',HTTP版本不受支持')
        break

      default:
    }
  }

  return Promise.reject(err)
});



/*-----------------axios基本配置-----------*/

Vue.prototype.$http = axios
Vue.prototype.$qs = Qs
Vue.config.productionTip = false

Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
