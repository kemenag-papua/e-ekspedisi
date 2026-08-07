import apiClient from '@/api/client'

/**
 * Endpoint master data unit kerja.
 * Backend: /api/v1/master/unit
 */
export const unitApi = {
  async getUnitList() {
    const { data } = await apiClient.get('/master/unit')
    return data
  },

  async getUnit(id) {
    const { data } = await apiClient.get(`/master/unit/${id}`)
    return data
  },

  async createUnit(payload) {
    const { data } = await apiClient.post('/master/unit', payload)
    return data
  },

  async updateUnit(id, payload) {
    const { data } = await apiClient.put(`/master/unit/${id}`, payload)
    return data
  },

  async deleteUnit(id) {
    const { data } = await apiClient.delete(`/master/unit/${id}`)
    return data
  },
}
