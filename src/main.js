import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
/*
目前只有页面级别的权限控制
如果你想开启按钮级别的权限控制，使用下面的代码
*/
/*
import permission from '@/directive/permission/index.js'
import permissionSource from '@/directive/permission/config'
Vue.prototype.$permission = permissionSource
Vue.directive('permission', {
  inserted(el, binding, vnode) {
    const { value } = binding
    const permissions = store.getters && store.getters.permission
    const permissionSources = permissions.map(item => item.permissionSource)
    if (value && value instanceof Array && value.length > 0) {
      const needPermissionSources = value
      const hasPermission = needPermissionSources.every(item => permissionSources.includes(item))
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need permissions! Like v-permission="[STUDENT_ADD]"`)
    }
  }
})
*/

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
/* if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
} */

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

