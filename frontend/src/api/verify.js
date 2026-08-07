import apiClient from '@/api/client'

/**
 * Endpoint verifikasi QR (publik, tanpa autentikasi).
 * Backend: /api/v1/verify
 */
export const verifyApi = {
  async verify(ekspedisiId, token) {
    const { data } = await apiClient.get(`/verify/${ekspedisiId}`, { params: { token } })
    return data
  },
}
