/**
 * SuratRepository.gs
 *
 * Repository untuk data surat keluar.
 * Mengelola akses ke sheet surat_keluar.
 *
 * Struktur sheet surat_keluar (Docs/05-Database-Data-Dictionary.md):
 * id | nomor_surat | tanggal_surat | perihal | unit_id | file_pdf | status | created_by | created_at | updated_at
 */

var SuratRepository = (function () {
  function sheetName() {
    return DatabaseConfig.SHEETS.SURAT_KELUAR;
  }

  /**
   * Mendapatkan seluruh surat keluar
   * @returns {Array}
   */
  function getAll() {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    return repo.getAll(sheetName());
  }

  /**
   * Mencari surat berdasarkan ID
   * @param {string} id - UUID surat
   * @returns {object|null}
   */
  function findById(id) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    return repo.findById(sheetName(), id);
  }

  /**
   * Mencari surat berdasarkan nomor surat (cek duplikasi)
   * @param {string} nomor - Nomor surat
   * @returns {object|null}
   */
  function findByNomor(nomor) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    return repo.findByColumn(sheetName(), 'nomor_surat', nomor);
  }

  /**
   * Menghitung jumlah surat pada tahun tertentu
   * @param {number} year - Tahun
   * @returns {number}
   */
  function countByYear(year) {
    var all = getAll();
    var count = 0;
    for (var i = 0; i < all.length; i++) {
      var t = new Date(all[i].created_at);
      if (t.getFullYear() === year) {
        count++;
      }
    }
    return count;
  }

  /**
   * Menyimpan surat baru
   * @param {object} data - Data surat
   * @returns {object} Surat yang disimpan
   */
  function insert(data) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var now = DateUtils.toDateTimeString(DateUtils.now());
    var suratData = {
      id: UuidUtils.generate(),
      nomor_surat: data.nomor_surat,
      tanggal_surat: data.tanggal_surat,
      perihal: data.perihal,
      unit_id: data.unit_id,
      file_pdf: data.file_pdf,
      status: data.status || 'menunggu_pengambilan',
      created_by: data.created_by || '',
      created_at: now,
      updated_at: now,
    };
    repo.insert(sheetName(), suratData);
    return suratData;
  }

  /**
   * Memperbarui surat
   * @param {string} id - UUID surat
   * @param {object} data - Data yang diperbarui
   * @returns {object|null}
   */
  function update(id, data) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var updateData = {
      updated_at: DateUtils.toDateTimeString(DateUtils.now()),
    };
    if (data.nomor_surat !== undefined) updateData.nomor_surat = data.nomor_surat;
    if (data.tanggal_surat !== undefined) updateData.tanggal_surat = data.tanggal_surat;
    if (data.perihal !== undefined) updateData.perihal = data.perihal;
    if (data.unit_id !== undefined) updateData.unit_id = data.unit_id;
    if (data.file_pdf !== undefined) updateData.file_pdf = data.file_pdf;
    if (data.status !== undefined) updateData.status = data.status;
    return repo.update(sheetName(), id, updateData);
  }

  /**
   * Menghapus surat
   * @param {string} id - UUID surat
   * @returns {boolean}
   */
  function remove(id) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    return repo.remove(sheetName(), id);
  }

  return {
    getAll: getAll,
    findById: findById,
    findByNomor: findByNomor,
    countByYear: countByYear,
    insert: insert,
    update: update,
    remove: remove,
  };
})();
