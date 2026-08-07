/**
 * AuthRepository.gs
 *
 * Repository untuk autentikasi.
 * Mengelola akses ke sheet pegawai dan session.
 *
 * Aturan (Docs/09-Development-Guide.md):
 * - Repository menangani akses Spreadsheet.
 * - Tidak boleh mengakses Spreadsheet langsung dari Controller.
 */

var AuthRepository = (function () {
  /**
   * Mencari pegawai berdasarkan username
   * @param {string} username - Username pegawai
   * @returns {object|null} Data pegawai atau null
   */
  function findByUsername(username) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var rows = repo.getAll(DatabaseConfig.SHEETS.PEGAWAI);
    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i].username).toLowerCase() === String(username).toLowerCase()) {
        return rows[i];
      }
    }
    return null;
  }

  /**
   * Mencari pegawai berdasarkan ID
   * @param {string} id - UUID pegawai
   * @returns {object|null} Data pegawai atau null
   */
  function findById(id) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    return repo.findById(DatabaseConfig.SHEETS.PEGAWAI, id);
  }

  /**
   * Mencari session berdasarkan token
   * @param {string} token - Session token
   * @returns {object|null} Data session atau null
   */
  function findSessionByToken(token) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var rows = repo.getAll(DatabaseConfig.SHEETS.SESSION);
    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i].token) === String(token)) {
        return rows[i];
      }
    }
    return null;
  }

  /**
   * Membuat session baru
   * @param {string} userId - UUID pegawai
   * @param {string} token - Session token
   * @returns {object} Data session yang disimpan
   */
  function createSession(userId, token) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var durationHours = DatabaseConfig.getSessionDurationHours();
    var expiresAt = new Date(DateUtils.now().getTime() + durationHours * 60 * 60 * 1000);

    var sessionData = {
      id: UuidUtils.generate(),
      user_id: userId,
      token: token,
      created_at: DateUtils.toDateTimeString(DateUtils.now()),
      expires_at: DateUtils.toDateTimeString(expiresAt),
      is_active: 'true',
    };
    repo.insert(DatabaseConfig.SHEETS.SESSION, sessionData);
    return sessionData;
  }

  /**
   * Menghapus session (logout)
   * @param {string} token - Session token
   * @returns {boolean} true jika berhasil
   */
  function deleteSession(token) {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var rows = repo.getAll(DatabaseConfig.SHEETS.SESSION);
    var sheet = repo.getSheet(DatabaseConfig.SHEETS.SESSION);

    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i].token) === String(token)) {
        var rowNumber = i + 2;
        sheet.deleteRow(rowNumber);
        return true;
      }
    }
    return false;
  }

  /**
   * Menonaktifkan session yang sudah kedaluwarsa
   * Dipanggil saat validasi token.
   */
  function cleanupExpiredSessions() {
    var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
    var rows = repo.getAll(DatabaseConfig.SHEETS.SESSION);
    var sheet = repo.getSheet(DatabaseConfig.SHEETS.SESSION);
    var now = new Date();

    // Hapus dari bawah agar index tidak bergeser
    for (var i = rows.length - 1; i >= 0; i--) {
      var expiresAt = new Date(rows[i].expires_at);
      if (rows[i].is_active === 'true' && expiresAt.getTime() < now.getTime()) {
        sheet.deleteRow(i + 2);
      }
    }
  }

  return {
    findByUsername: findByUsername,
    findById: findById,
    findSessionByToken: findSessionByToken,
    createSession: createSession,
    deleteSession: deleteSession,
    cleanupExpiredSessions: cleanupExpiredSessions,
  };
})();
