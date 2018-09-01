import Vue from 'vue'
import Axios from 'axios'
import VueAxios from 'vue-axios'

import Util from './core/request'
Vue.use(VueAxios, Axios)

export default {
  ...Util
}
