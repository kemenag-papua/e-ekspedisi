import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
    token: localStorage.getItem('auth_token') || '',
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    isSuperAdmin: (state) => state.user?.role === 'super_admin',
    isAdmin: (state) => state.user?.role === 'admin',
    isPimpinan: (state) => state.user?.role === 'pimpinan',
  },

  actions: {
    async login(username, password) {
      this.loading = true
      try {
        const response = await authApi.login(username, password)
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('auth_token', this.token)
        localStorage.setItem('auth_user', JSON.stringify(this.user))
        if (response.data.token_expires_at) {
          localStorage.setItem('auth_token_expires', new Date(response.data.token_expires_at).getTime())
        }
        return response
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await authApi.logout()
      } catch {
        // Abaikan error logout, tetap bersihkan session lokal
      } finally {
        this.token = ''
        this.user = null
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_token_expires')
      }
    },

    async fetchMe() {
      try {
        const response = await authApi.getMe()
        this.user = response.data
        localStorage.setItem('auth_user', JSON.stringify(this.user))
        return response
      } catch (e) {
        this.logout()
        throw e
      }
    },
  },
})
