import axios from 'axios'

/**
 * API Client untuk berkomunikasi dengan backend Google Apps Script.
 *
 * Strategi CORS:
 * - Content-Type: text/plain + body JSON string (hindari preflight OPTIONS)
 * - Token aplikasi via query param ?token= (bukan header Authorization)
 * - TANPA withCredentials: auth memakai token query, bukan cookie.
 *   withCredentials memicu credentialed mode yang mengharuskan ACAO
 *   spesifik + Access-Control-Allow-Credentials yang tidak bisa
 *   dipenuhi GAS ContentService.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 20000,
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

    // GAS Web App hanya punya doGet/doPost (tidak ada doPut/doDelete).
    // Konversi PUT/DELETE -> POST + query ?_method=PUT/DELETE
    const origMethod = (config.method || 'get').toLowerCase()
    if (origMethod === 'put' || origMethod === 'delete') {
      config.method = 'post'
      config.params = { ...(config.params || {}), _method: origMethod.toUpperCase() }
    }

    // BUG GAS #160622846: pathInfo setelah /exec memicu sign-in wall untuk anonim.
    // Solusi: pindahkan route dari path ke query param `?path=`.
    // Contoh: apiClient.post('/auth/login') -> .../exec?path=%2Fapi%2Fv1%2Fauth%2Flogin
    const route = config.url || ''
    config.url = ''
    config.params = { ...(config.params || {}), path: '/api/v1' + route }

    // Kirim token via query param (bukan header) untuk hindari CORS preflight
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.params.token = token
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
