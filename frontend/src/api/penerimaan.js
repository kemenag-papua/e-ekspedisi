import apiClient from '@/api/client'

/**
 * Endpoint konfirmasi penerimaan.
 * Backend: /api/v1/penerimaan
 */
export const penerimaanApi = {
  async createPenerimaan(payload) {
    const { data } = await apiClient.post('/penerimaan', payload)
    return data
  },

  async getPenerimaan(id) {
    const { data } = await apiClient.get(`/penerimaan/${id}`)
    return data
  },
}
