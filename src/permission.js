import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getRefreshToken } from '@/utils/auth' // get token from cookie
import { resetRouter } from '@/router'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken() && getRefreshToken()
  if (hasToken) {
    // 登录成功
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // 获取用户信息(权限)
      const permission = store.getters.permission
      const hasPermission = permission && permission.length > 0
      if (hasPermission) {
        // TODO: 解决刷新，动态路由失效问题
        /* if (store.getters.isFresh === true) {
          console.log('')
          console.log('重新添加路由')
          console.log(store.getters.permission_addRoutes)
          router.addRoutes(store.getters.permission_addRoutes)
          store.dispatch('app/setFresh', false)
          next({ ...to, replace: true })
        } */
        // 有权限
        next()
      } else {
        // 没有权限
        try {
          // 获取用户信息
          const results = await Promise.all([
            store.dispatch('user/getInfo'),
            store.dispatch('user/getPermission'),
            store.dispatch('user/getRole')
          ])
          // 格式化处理
          const rawPermissions = results[1]
          const permissions = []
          rawPermissions.forEach(permission => {
            const permissionSource = permission.permissionSource
            if (permissionSource.split(':')[1] === 'manage') {
              permissions.push(permissionSource)
            }
          })
          // 生成路由
          store.dispatch('permission/generateRoutes', permissions)
            .then((accessRoutes) => {
              // 解决再次登录路由重复添加的问题
              resetRouter()
              // 成功，说明是刚登陆
              console.log(accessRoutes)
              router.addRoutes(accessRoutes)
              next({ ...to, replace: true })
            })
        } catch (error) {
          // 失败，说明是假token
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有token，判断是否是白名单路由
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 不是，跳转到登录页
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
