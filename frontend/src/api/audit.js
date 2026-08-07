import apiClient from '@/api/client'

/**
 * Endpoint audit trail.
 * Backend: /api/v1/audit
 */
export const auditApi = {
  async getAuditList(params) {
    const { data } = await apiClient.get('/audit', { params })
    return data
  },
}
