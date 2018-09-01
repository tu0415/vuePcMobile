import Vue from 'vue'
import Vuex from 'vuex'
import commonStore from './commonStore'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  strict: debug,
  ...commonStore
})
export default store
