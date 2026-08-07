import apiClient from '@/api/client'

/**
 * Endpoint autentikasi.
 * Mengacu pada Docs/06-API-Specification.md bagian Autentikasi.
 */
export const authApi = {
  async login(username, password) {
    const { data } = await apiClient.post('/auth/login', { username, password })
    return data
  },

  async logout() {
    const { data } = await apiClient.post('/auth/logout')
    return data
  },

  async getMe() {
    const { data } = await apiClient.get('/auth/me')
    return data
  },
}
