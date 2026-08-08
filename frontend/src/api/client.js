import axios from 'axios'

/**
 * API Client untuk berkomunikasi dengan backend Google Apps Script.
 * Base URL dikonfigurasi via env variable VITE_API_BASE_URL.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Cek apakah token sudah kedaluwarsa (hardening Sprint 9)
 * @returns {boolean} true jika token expired
 */
function isTokenExpired() {
  const expiresAt = localStorage.getItem('auth_token_expires')
  if (!expiresAt) return false
  return Date.now() > parseInt(expiresAt, 10)
}

/**
 * Bersihkan session lokal dan redirect ke login
 */
function forceLogout() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
  localStorage.removeItem('auth_token_expires')
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

apiClient.interceptors.request.use(
  (config) => {
    // Cek expiry sebelum kirim request
    if (isTokenExpired()) {
      forceLogout()
      return Promise.reject(new Error('Token kedaluwarsa'))
    }
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 = token tidak valid/session habis
    if (error.response?.status === 401) {
      forceLogout()
    }
    // 429 = rate limit, tampilkan pesan
    if (error.response?.status === 429) {
      const msg = error.response.data?.message || 'Terlalu banyak permintaan. Coba lagi nanti.'
      error.userMessage = msg
    }
    return Promise.reject(error)
  }
)

export default apiClient
