import { auth, authObj } from '@/services/firebase'

const SET_LOGGED = 'SET_LOGGED'
const SET_LOGGED_OUT = 'SET_LOGGED_OUT'

export default {
  state: {
    user: null,
    logged: false
  },
  actions: {
    signIn({ commit }, { email, password }) {
      return new Promise((resolve, reject) => {
        auth
          .login(email, password)
          .then(response => {
            resolve(response)
            commit(SET_LOGGED)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    async signOut({ commit }) {
      await auth.logout()
      commit(SET_LOGGED_OUT)
    },
    async fetchCurrentUser({ commit }) {
      const user = authObj.currentUser
      if (user !== null) {
        commit(SET_LOGGED)
      }
    }
  },
  mutations: {
    [SET_LOGGED](state) {
      state.logged = true
    },
    [SET_LOGGED_OUT](state) {
      state.logged = false
    }
  }
}
