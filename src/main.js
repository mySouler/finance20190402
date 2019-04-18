// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui';
import store from './vuex'
import '../static/css/base.css'
import 'element-ui/lib/theme-chalk/index.css';
import 'babel-polyfill'
import App from './App'
import axios from 'axios'
import Qs from 'qs'

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
