const getters = {
  token: state => state.user.token,
  roles: state => state.user.roles,
  sidebar: state => state.app.sidebar,
  permission_routes: state => state.permission.routes,
  device: state => state.app.device,
  errorLogs: state => state.errorLog.logs,
  size: state => state.app.size,
  avatar: state => state.user.avatar
}

export default getters
