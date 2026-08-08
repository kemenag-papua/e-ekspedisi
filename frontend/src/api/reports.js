import apiClient from '@/api/client'

/**
 * Endpoint laporan.
 * Backend: /api/v1/reports
 */
export const reportsApi = {
  async getSuratReport(params) {
    const { data } = await apiClient.get('/reports/surat', { params })
    return data
  },
}
