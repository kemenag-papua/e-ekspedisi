/**
 * DatabaseConfig.gs
 *
 * Konfigurasi database (Google Spreadsheet).
 * Ubah SPREADSHEET_ID sesuai Spreadsheet yang digunakan.
 *
 * Struktur spreadsheet mengacu pada Docs/05-Database-Data-Dictionary.md:
 * - surat_keluar
 * - ekspedisi
 * - penerimaan
 * - pegawai
 * - master_unit
 * - konfigurasi
 * - audit_log
 */

var DatabaseConfig = (function () {
  // TODO: Ganti dengan ID Spreadsheet aktual
  // Cara mendapatkan ID:
  // 1. Jalankan scripts/setup-spreadsheet.gs di Google Apps Script Editor
  // 2. Salin nilai SPREADSHEET_ID dari log hasil setup
  var SPREADSHEET_ID = '1tPmy0-nP3rLID1Y-GZXQjWYG3YwoPFNrVp-isVACZxE';

  var SHEETS = {
    SURAT_KELUAR: 'surat_keluar',
    EKSPEDISI: 'ekspedisi',
    PENERIMAAN: 'penerimaan',
    PEGAWAI: 'pegawai',
    MASTER_UNIT: 'master_unit',
    KONFIGURASI: 'konfigurasi',
    AUDIT_LOG: 'audit_log',
    SESSION: 'session',
  };

  /**
   * Durasi session aktif (dalam jam)
   * @returns {number}
   */
  function getSessionDurationHours() {
    return 8;
  }

  /**
   * Mendapatkan ID Spreadsheet
   * @returns {string}
   */
  function getSpreadsheetId() {
    return SPREADSHEET_ID;
  }

  /**
   * Mendapatkan nama sheet
   * @param {string} key - Key konstanta
   * @returns {string}
   */
  function getSheetName(key) {
    return SHEETS[key];
  }

  /**
   * Mendapatkan semua konfigurasi dari sheet konfigurasi
   * Menggunakan cache 5 menit (Sprint 9 - performa)
   * @returns {object} Map konfigurasi
   */
  function getAppConfig() {
    return CacheHelper.getCached('konfigurasi_all', function () {
      var repo = new BaseRepository(SPREADSHEET_ID);
      var rows = repo.getAll(SHEETS.KONFIGURASI);
      var config = {};
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].key) {
          config[rows[i].key] = rows[i].value;
        }
      }
      return config;
    }, 300);
  }

  return {
    getSpreadsheetId: getSpreadsheetId,
    getSheetName: getSheetName,
    getAppConfig: getAppConfig,
    getSessionDurationHours: getSessionDurationHours,
    SHEETS: SHEETS,
  };
})();
