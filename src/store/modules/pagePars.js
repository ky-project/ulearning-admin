const state = {
  pagePars: new Map()
}

const mutations = {
  SAVE_PAGE_PARS: (state, { path, pars }) => {
    state.pagePars.set(path, pars)
  }
}

const actions = {
  savePagePars: ({ commit }, { path, pars }) => {
    commit('SAVE_PAGE_PARS', { path, pars })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

