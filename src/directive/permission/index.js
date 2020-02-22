import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const permissions = store.getters && store.getters.permission
    const permissionSources = permissions.map(item => item.permissionSource)
    if (value && value instanceof Array && value.length > 0) {
      const needPermissionSources = value
      const hasPermission = needPermissionSources.every(item =>
        permissionSources.includes(item)
      )
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need permissions! Like v-permission="[STUDENT_ADD]"`)
    }
  }
}
