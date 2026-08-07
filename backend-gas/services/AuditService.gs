/**
 * AuditService.gs
 *
 * Service untuk mencatat audit trail.
 * Struktur sheet audit_log mengacu pada Docs/05-Database-Data-Dictionary.md:
 * id | user | aksi | objek | hasil | waktu
 *
 * Aturan (Docs/03-PRD.md NFR-003):
 * - Audit trail wajib aktif.
 * - Audit trail tidak boleh diubah.
 */

var AuditService = (function () {
  /**
   * Mencatat aktivitas ke audit log
   * @param {string} user - Pengguna yang melakukan aksi
   * @param {string} aksi - Aktivitas (contoh: 'LOGIN', 'CREATE_SURAT')
   * @param {string} objek - Entitas (contoh: 'surat_keluar')
   * @param {string} hasil - 'Success' atau 'Fail'
   * @returns {object} Data audit yang disimpan
   */
  function log(user, aksi, objek, hasil) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var auditData = {
      id: UuidUtils.generate(),
      user: user || 'system',
      aksi: aksi || '',
      objek: objek || '',
      hasil: hasil || 'Success',
      waktu: DateUtils.toDateTimeString(DateUtils.now()),
    };
    repo.insert(DatabaseConfig.SHEETS.AUDIT_LOG, auditData);
    return auditData;
  }

  /**
   * Mendapatkan seluruh audit log
   * @param {object} filter - Filter opsional { user, aksi, objek }
   * @returns {Array} Audit logs
   */
  function getAll(filter) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var logs = repo.getAll(DatabaseConfig.SHEETS.AUDIT_LOG);
    if (filter) {
      if (filter.user) {
        logs = logs.filter(function (l) {
          return l.user === filter.user;
        });
      }
      if (filter.aksi) {
        logs = logs.filter(function (l) {
          return l.aksi === filter.aksi;
        });
      }
      if (filter.objek) {
        logs = logs.filter(function (l) {
          return l.objek === filter.objek;
        });
      }
    }
    // Urutkan dari terbaru
    logs.sort(function (a, b) {
      return String(b.waktu).localeCompare(String(a.waktu));
    });
    return logs;
  }

  return {
    log: log,
    getAll: getAll,
  };
})();
