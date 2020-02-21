const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  userInfo: state => state.user.userInfo,
  permission: state => state.user.permission,
  role: state => state.user.role,
  permission_routes: state => state.permission.routes
}
export default getters
