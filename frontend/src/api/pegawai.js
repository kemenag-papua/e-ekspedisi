import apiClient from '@/api/client'

/**
 * Endpoint master data pegawai (pengguna aplikasi).
 * Backend: /api/v1/master/pegawai
 */
export const pegawaiApi = {
  async getPegawaiList() {
    const { data } = await apiClient.get('/master/pegawai')
    return data
  },

  async getPegawai(id) {
    const { data } = await apiClient.get(`/master/pegawai/${id}`)
    return data
  },

  async createPegawai(payload) {
    const { data } = await apiClient.post('/master/pegawai', payload)
    return data
  },

  async updatePegawai(id, payload) {
    const { data } = await apiClient.put(`/master/pegawai/${id}`, payload)
    return data
  },

  async deletePegawai(id) {
    const { data } = await apiClient.delete(`/master/pegawai/${id}`)
    return data
  },
}
