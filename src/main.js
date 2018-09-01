import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import store from './store/index'
import 'element-ui/lib/theme-chalk/index.css'
import 'nprogress/nprogress.css'
import './assets/common.css'

import helper from "./utils/helper";

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.use(helper)

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
