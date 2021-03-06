import defaultSettings from '@/settings'
import variables from '@/styles/element-variables.scss'

const { sidebarLogo, tagsView, showSettings, fixedHeader } = defaultSettings

const state = {
  sidebarLogo,
  tagsView,
  showSettings,
  fixedHeader,
  theme: variables.theme
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
