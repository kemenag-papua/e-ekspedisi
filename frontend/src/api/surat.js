import apiClient from '@/api/client'

/**
 * Endpoint surat keluar.
 * Backend: /api/v1/surat
 */
export const suratApi = {
  async getSuratList(params) {
    const { data } = await apiClient.get('/surat', { params })
    return data
  },

  async getSurat(id) {
    const { data } = await apiClient.get(`/surat/${id}`)
    return data
  },

  async createSurat(payload) {
    const { data } = await apiClient.post('/surat', payload)
    return data
  },

  async updateSurat(id, payload) {
    const { data } = await apiClient.put(`/surat/${id}`, payload)
    return data
  },

  async deleteSurat(id) {
    const { data } = await apiClient.delete(`/surat/${id}`)
    return data
  },
}
