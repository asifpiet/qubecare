import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    provider: null,
    patient: null,
    affiliate: null,
    partner: null,
  }),
  actions: {
    setUser(user, role) {
      this[role] = user
    },
    clearUser(role) {
      this[role] = null
    },
    clearAllUsers() {
      this.provider = null
      this.patient = null
      this.affiliate = null
      this.partner = null
    },
  },
  getters: {
    isAuthenticated: (state) => (role) => {
      console.log('isAuthenticated', state, role)
      return state[role] && state[role] !== null
    },
    getUserByRole: (state) => (role) => {
      return state[role]
    },
  },
})
