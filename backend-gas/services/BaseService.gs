/**
 * BaseService.gs
 *
 * Service base untuk business logic.
 * Semua service harus mewarisi kelas ini (Service Pattern).
 *
 * Aturan (Docs/09-Development-Guide.md):
 * - Service berisi business rule.
 * - Service melakukan validasi.
 * - Service melakukan logging audit.
 */

var BaseService = (function () {
  function BaseService(repository) {
    this.repository = repository;
  }

  /**
   * Logging audit untuk setiap operasi
   * @param {string} user - Pengguna
   * @param {string} aksi - Aktivitas
   * @param {string} objek - Entitas
   * @param {string} hasil - Success/Fail
   */
  function logAudit(user, aksi, objek, hasil) {
    try {
      AuditService.log(user, aksi, objek, hasil);
    } catch (e) {
      Logger.warn('BaseService', 'Gagal menulis audit log', e.message);
    }
  }

  return {
    logAudit: logAudit,
  };
})();
