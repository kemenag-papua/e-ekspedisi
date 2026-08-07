/**
 * PegawaiRepository.gs
 *
 * Repository untuk data pegawai (pengguna aplikasi).
 * Mengelola akses ke sheet pegawai.
 *
 * Struktur sheet pegawai:
 * id | nama | username | password | role | unit_id | no_hp | email | is_active | created_at | updated_at
 */

var PegawaiRepository = (function () {
  function sheetName() {
    return DatabaseConfig.SHEETS.PEGAWAI;
  }

  /**
   * Mendapatkan seluruh pegawai
   * @returns {Array}
   */
  function getAll() {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    return repo.getAll(sheetName());
  }

  /**
   * Mencari pegawai berdasarkan ID
   * @param {string} id - UUID pegawai
   * @returns {object|null}
   */
  function findById(id) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    return repo.findById(sheetName(), id);
  }

  /**
   * Mencari pegawai berdasarkan username (cek duplikasi)
   * @param {string} username - Username
   * @returns {object|null}
   */
  function findByUsername(username) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var rows = repo.getAll(sheetName());
    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i].username).toLowerCase() === String(username).toLowerCase()) {
        return rows[i];
      }
    }
    return null;
  }

  /**
   * Menyimpan pegawai baru
   * @param {object} data - Data pegawai
   * @returns {object} Data pegawai yang disimpan
   */
  function insert(data) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var pegawaiData = {
      id: UuidUtils.generate(),
      nama: data.nama,
      username: data.username,
      password: data.password,
      role: data.role,
      unit_id: data.unit_id || '',
      no_hp: data.no_hp || '',
      email: data.email || '',
      is_active: data.is_active === false ? 'false' : 'true',
      created_at: DateUtils.toDateTimeString(DateUtils.now()),
      updated_at: DateUtils.toDateTimeString(DateUtils.now()),
    };
    repo.insert(sheetName(), pegawaiData);
    return pegawaiData;
  }

  /**
   * Memperbarui pegawai
   * @param {string} id - UUID pegawai
   * @param {object} data - Data yang diperbarui
   * @returns {object|null}
   */
  function update(id, data) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var updateData = {
      updated_at: DateUtils.toDateTimeString(DateUtils.now()),
    };
    if (data.nama !== undefined) updateData.nama = data.nama;
    if (data.username !== undefined) updateData.username = data.username;
    if (data.password !== undefined) updateData.password = data.password;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.unit_id !== undefined) updateData.unit_id = data.unit_id;
    if (data.no_hp !== undefined) updateData.no_hp = data.no_hp;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.is_active !== undefined) updateData.is_active = data.is_active === true ? 'true' : 'false';
    return repo.update(sheetName(), id, updateData);
  }

  /**
   * Menghapus pegawai
   * @param {string} id - UUID pegawai
   * @returns {boolean}
   */
  function remove(id) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    return repo.remove(sheetName(), id);
  }

  return {
    getAll: getAll,
    findById: findById,
    findByUsername: findByUsername,
    insert: insert,
    update: update,
    remove: remove,
  };
})();
