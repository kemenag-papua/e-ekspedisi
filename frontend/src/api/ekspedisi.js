import apiClient from '@/api/client'

/**
 * Endpoint ekspedisi.
 * Backend: /api/v1/ekspedisi
 */
export const ekspedisiApi = {
  async getEkspedisi(id) {
    const { data } = await apiClient.get(`/ekspedisi/${id}`)
    return data
  },

  async regenerateQr(id) {
    const { data } = await apiClient.post(`/ekspedisi/${id}/qr`)
    return data
  },
}
