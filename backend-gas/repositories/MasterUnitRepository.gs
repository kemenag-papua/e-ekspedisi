/**
 * MasterUnitRepository.gs
 *
 * Repository untuk master data unit kerja.
 * Mengelola akses ke sheet master_unit.
 *
 * Struktur sheet master_unit:
 * id | nama | keterangan | created_at | updated_at
 */

var MasterUnitRepository = (function () {
  var SHEET_NAME = function () {
    return DatabaseConfig.SHEETS.MASTER_UNIT;
  };

  /**
   * Mendapatkan seluruh unit kerja
   * Menggunakan cache 5 menit (Sprint 9 - performa)
   * @returns {Array} Daftar unit
   */
  function getAll() {
    return CacheHelper.getCached('master_unit_all', function () {
      var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
      return repo.getAll(SHEET_NAME());
    }, 300);
  }

  /**
   * Mencari unit berdasarkan ID
   * @param {string} id - UUID unit
   * @returns {object|null} Data unit atau null
   */
  function findById(id) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    return repo.findById(SHEET_NAME(), id);
  }

  /**
   * Mencari unit berdasarkan nama (cek duplikasi)
   * @param {string} nama - Nama unit
   * @returns {object|null} Data unit atau null
   */
  function findByNama(nama) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var rows = repo.getAll(SHEET_NAME());
    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i].nama).toLowerCase() === String(nama).toLowerCase()) {
        return rows[i];
      }
    }
    return null;
  }

  /**
   * Menyimpan unit baru
   * @param {object} data - { nama, keterangan }
   * @returns {object} Data unit yang disimpan
   */
  function insert(data) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var unitData = {
      id: UuidUtils.generate(),
      nama: data.nama,
      keterangan: data.keterangan || '',
      created_at: DateUtils.toDateTimeString(DateUtils.now()),
      updated_at: DateUtils.toDateTimeString(DateUtils.now()),
    };
    repo.insert(SHEET_NAME(), unitData);
    return unitData;
  }

  /**
   * Memperbarui unit
   * @param {string} id - UUID unit
   * @param {object} data - { nama, keterangan }
   * @returns {object|null} Data unit yang diperbarui atau null
   */
  function update(id, data) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var updateData = {
      updated_at: DateUtils.toDateTimeString(DateUtils.now()),
    };
    if (data.nama !== undefined) updateData.nama = data.nama;
    if (data.keterangan !== undefined) updateData.keterangan = data.keterangan;
    return repo.update(SHEET_NAME(), id, updateData);
  }

  /**
   * Menghapus unit (soft delete)
   * @param {string} id - UUID unit
   * @returns {boolean} true jika berhasil
   */
  function remove(id) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    return repo.remove(SHEET_NAME(), id);
  }

  return {
    getAll: getAll,
    findById: findById,
    findByNama: findByNama,
    insert: insert,
    update: update,
    remove: remove,
  };
})();
