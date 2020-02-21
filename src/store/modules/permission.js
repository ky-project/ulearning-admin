import { asyncRoutes, constantRoutes } from '@/router'

function copyExpectChildren(obj) {
  const temp = { ...obj }
  delete temp.children
  temp.children = []
  return temp
}

export function filterAsyncRoutes(node, permissions) {
  if (node.children) {
    const tempNode = copyExpectChildren(node)
    node.children.forEach(childNode => {
      const obj = filterAsyncRoutes(childNode, permissions)
      if (obj.result) {
        tempNode.children.push(obj.node)
      }
    })
    return {
      result: tempNode.children.length > 0,
      node: tempNode
    }
  } else {
    // 叶节点
    const result = permissions.includes(node.meta.permission)
    return {
      result,
      node
    }
  }
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, permissions) {
    return new Promise(resolve => {
      // 包装路由
      const wrapRoutes = {
        children: [...asyncRoutes]
      }
      // 递归添加动态路由
      const routes = filterAsyncRoutes(wrapRoutes, permissions)
      // 解包路由
      const accessRoutes = routes.node.children
      console.log('accessRoutes', accessRoutes)
      commit('SET_ROUTES', accessRoutes)
      resolve(accessRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
