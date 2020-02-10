const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // token: state => state.user.token,
  // refreshToken: state => state.user.refreshToken,
  userInfo: state => state.user.userInfo,
  permission: state => state.user.permission,
  role: state => state.user.role
}
export default getters
