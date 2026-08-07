/**
 * PenerimaanRepository.gs
 *
 * Repository untuk data penerimaan (bukti penerimaan dokumen).
 * Mengelola akses ke sheet penerimaan.
 *
 * Struktur sheet penerimaan (Docs/05-Database-Data-Dictionary.md):
 * id | ekspedisi_id | nama_penerima | jabatan | instansi | foto_url | signature_url | gps_lat | gps_lng | pdf_bukti | diterima_pada | created_by
 */

var PenerimaanRepository = (function () {
  function sheetName() {
    return DatabaseConfig.SHEETS.PENERIMAAN;
  }

  /**
   * Mendapatkan seluruh data penerimaan
   * @returns {Array}
   */
  function getAll() {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    return repo.getAll(sheetName());
  }

  /**
   * Mencari penerimaan berdasarkan ID
   * @param {string} id - UUID penerimaan
   * @returns {object|null}
   */
  function findById(id) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    return repo.findById(sheetName(), id);
  }

  /**
   * Mencari penerimaan berdasarkan ekspedisi ID
   * @param {string} ekspedisiId - UUID ekspedisi
   * @returns {object|null}
   */
  function findByEkspedisiId(ekspedisiId) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    return repo.findByColumn(sheetName(), 'ekspedisi_id', ekspedisiId);
  }

  /**
   * Menyimpan data penerimaan baru
   * @param {object} data - Data penerimaan
   * @returns {object} Data yang disimpan
   */
  function insert(data) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var penerimaanData = {
      id: UuidUtils.generate(),
      ekspedisi_id: data.ekspedisi_id,
      nama_penerima: data.nama_penerima,
      jabatan: data.jabatan,
      instansi: data.instansi,
      foto_url: data.foto_url || '',
      signature_url: data.signature_url || '',
      gps_lat: data.gps_lat || '',
      gps_lng: data.gps_lng || '',
      pdf_bukti: data.pdf_bukti || '',
      diterima_pada: DateUtils.toDateTimeString(DateUtils.now()),
      created_by: data.created_by || '',
    };
    repo.insert(sheetName(), penerimaanData);
    return penerimaanData;
  }

  /**
   * Memperbarui data penerimaan (misalnya menambah pdf_bukti)
   * @param {string} id - UUID penerimaan
   * @param {object} data - Data yang diperbarui
   * @returns {object|null}
   */
  function update(id, data) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var updateData = {};
    if (data.pdf_bukti !== undefined) updateData.pdf_bukti = data.pdf_bukti;
    return repo.update(sheetName(), id, updateData);
  }

  return {
    getAll: getAll,
    findById: findById,
    findByEkspedisiId: findByEkspedisiId,
    insert: insert,
    update: update,
  };
})();
