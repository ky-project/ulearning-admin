const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  isFresh: state => state.app.isFresh,
  userInfo: state => state.user.userInfo,
  permission: state => state.user.permission,
  role: state => state.user.role,
  permission_routes: state => state.permission.routes,
  permission_addRoutes: state => state.permission.addRoutes
}
export default getters
