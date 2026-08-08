import apiClient from '@/api/client'

/**
 * Endpoint dashboard.
 * Backend: /api/v1/dashboard
 */
export const dashboardApi = {
  async getSummary() {
    const { data } = await apiClient.get('/dashboard/summary')
    return data
  },

  async getChart() {
    const { data } = await apiClient.get('/dashboard/chart')
    return data
  },

  async getRecent(params) {
    const { data } = await apiClient.get('/dashboard/recent', { params })
    return data
  },
}
