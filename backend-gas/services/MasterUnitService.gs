/**
 * MasterUnitService.gs
 *
 * Service untuk business logic master data unit kerja.
 *
 * Business Rules yang diterapkan:
 * - Nama unit wajib diisi.
 * - Nama unit tidak boleh duplikat (ConflictError).
 */

var MasterUnitService = (function () {
  /**
   * Mendapatkan seluruh unit kerja
   * @returns {Array}
   */
  function getAll() {
    return MasterUnitRepository.getAll();
  }

  /**
   * Mendapatkan unit berdasarkan ID
   * @param {string} id - UUID unit
   * @returns {object} Data unit
   * @throws {NotFoundError} Jika tidak ditemukan
   */
  function getById(id) {
    var unit = MasterUnitRepository.findById(id);
    if (!unit) {
      throw new NotFoundError('Unit tidak ditemukan');
    }
    return unit;
  }

  /**
   * Membuat unit baru
   * @param {object} data - { nama, keterangan }
   * @returns {object} Data unit yang dibuat
   */
  function create(data) {
    if (!data.nama || String(data.nama).trim() === '') {
      throw new ValidationError('Nama unit wajib diisi');
    }

    var existing = MasterUnitRepository.findByNama(data.nama);
    if (existing) {
      throw new ConflictError('Nama unit sudah digunakan');
    }

    var result = MasterUnitRepository.insert(data);
    CacheHelper.invalidate('master_unit_all');
    return result;
  }

  /**
   * Memperbarui unit
   * @param {string} id - UUID unit
   * @param {object} data - { nama, keterangan }
   * @returns {object} Data unit yang diperbarui
   */
  function update(id, data) {
    getById(id);

    if (data.nama && String(data.nama).trim() !== '') {
      var existing = MasterUnitRepository.findByNama(data.nama);
      if (existing && existing.id !== id) {
        throw new ConflictError('Nama unit sudah digunakan');
      }
    }

    var result = MasterUnitRepository.update(id, data);
    CacheHelper.invalidate('master_unit_all');
    return result;
  }

  /**
   * Menghapus unit
   * @param {string} id - UUID unit
   * @returns {boolean}
   */
  function remove(id) {
    getById(id);
    var result = MasterUnitRepository.remove(id);
    CacheHelper.invalidate('master_unit_all');
    return result;
  }

  return {
    getAll: getAll,
    getById: getById,
    create: create,
    update: update,
    remove: remove,
  };
})();
