import axios from 'axios'

/**
 * API Client untuk berkomunikasi dengan backend Google Apps Script.
 *
 * STRATEGI CORS (penting):
 * Google Apps Script Web App dengan access ANYONE membutuhkan session
 * Google untuk melayani request (request anonim dengan path di-redirect
 * ke ServiceLogin yang tidak bisa diselesaikan fetch cross-origin).
 *
 * Solusi: withCredentials: true sehingga browser mengirim cookie Google
 * (user aplikasi login Google di browser). GAS melihat session -> layani
 * langsung dengan response + Access-Control-Allow-Origin.
 *
 * Pendukung:
 * - Content-Type: text/plain (hindari preflight)
 * - Token aplikasi via query param ?token=
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 20000,
  withCredentials: true,
  headers: {
    'Content-Type': 'text/plain',
  },
  // Ubah body object menjadi JSON string (karena content-type text/plain)
  transformRequest: [
    (data) => {
      if (data && typeof data === 'object') {
        return JSON.stringify(data)
      }
      return data
    },
  ],
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
  const base = import.meta.env.BASE_URL || '/'
  const loginPath = `${base}login`
  if (!window.location.pathname.endsWith('/login')) {
    window.location.href = loginPath
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
      // Kirim token via query param (bukan header) untuk hindari CORS preflight
      config.params = { ...(config.params || {}), token }
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
