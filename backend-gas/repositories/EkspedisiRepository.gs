/**
 * EkspedisiRepository.gs
 *
 * Repository untuk data ekspedisi.
 * Mengelola akses ke sheet ekspedisi.
 *
 * Struktur sheet ekspedisi (Docs/05-Database-Data-Dictionary.md):
 * id | nomor_ekspedisi | surat_id | qr_token | qr_url
 */

var EkspedisiRepository = (function () {
  function sheetName() {
    return DatabaseConfig.SHEETS.EKSPEDISI;
  }

  /**
   * Mendapatkan seluruh ekspedisi
   * @returns {Array}
   */
  function getAll() {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    return repo.getAll(sheetName());
  }

  /**
   * Mencari ekspedisi berdasarkan ID
   * @param {string} id - UUID ekspedisi
   * @returns {object|null}
   */
  function findById(id) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    return repo.findById(sheetName(), id);
  }

  /**
   * Mencari ekspedisi berdasarkan surat ID
   * @param {string} suratId - UUID surat keluar
   * @returns {object|null}
   */
  function findBySuratId(suratId) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    return repo.findByColumn(sheetName(), 'surat_id', suratId);
  }

  /**
   * Menyimpan ekspedisi baru
   * @param {object} data - { surat_id, nomor_ekspedisi, qr_token, qr_url }
   * @returns {object} Ekspedisi yang disimpan
   */
  function insert(data) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var ekspedisiData = {
      id: UuidUtils.generate(),
      nomor_ekspedisi: data.nomor_ekspedisi,
      surat_id: data.surat_id,
      qr_token: data.qr_token || '',
      qr_url: data.qr_url || '',
    };
    repo.insert(sheetName(), ekspedisiData);
    return ekspedisiData;
  }

  /**
   * Memperbarui ekspedisi
   * @param {string} id - UUID ekspedisi
   * @param {object} data - Data yang diperbarui
   * @returns {object|null}
   */
  function update(id, data) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var updateData = {};
    if (data.qr_token !== undefined) updateData.qr_token = data.qr_token;
    if (data.qr_url !== undefined) updateData.qr_url = data.qr_url;
    return repo.update(sheetName(), id, updateData);
  }

  /**
   * Menghapus ekspedisi
   * @param {string} id - UUID ekspedisi
   * @returns {boolean}
   */
  function remove(id) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    return repo.remove(sheetName(), id);
  }

  /**
   * Menghitung jumlah ekspedisi pada tahun tertentu
   * Berdasarkan prefix nomor_ekspedisi (EXP-YYYY-XXXXXX)
   * @param {number} year - Tahun
   * @returns {number}
   */
  function countByYear(year) {
    var all = getAll();
    var prefix = 'EXP-' + year + '-';
    var count = 0;
    for (var i = 0; i < all.length; i++) {
      if (String(all[i].nomor_ekspedisi).indexOf(prefix) === 0) {
        count++;
      }
    }
    return count;
  }

  return {
    getAll: getAll,
    findById: findById,
    findBySuratId: findBySuratId,
    insert: insert,
    update: update,
    remove: remove,
    countByYear: countByYear,
  };
})();
