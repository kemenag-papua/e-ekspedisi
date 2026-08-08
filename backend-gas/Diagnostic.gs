/**
 * Diagnostic.gs
 *
 * Fungsi diagnostik untuk troubleshooting (bukan bagian dari production).
 * Dipanggil manual dari Apps Script Editor.
 *
 * CATATAN: gunakan console.log, bukan Logger.log, karena backend memiliki
 * variabel global Logger sendiri (utils/Logger.gs) yang menimpa built-in Logger.
 */

/**
 * Diagnosa masalah login:
 * - Membaca isi sheet pegawai
 * - Mengecek apakah user 'admin' ditemukan
 * - Membandingkan hash password tersimpan dengan hash Admin123!
 */
function diagnoseLogin() {
  console.log('=== DIAGNOSA LOGIN ===');
  console.log('Spreadsheet ID: ' + DatabaseConfig.getSpreadsheetId());

  var repo = new BaseRepository(DatabaseConfig.getSpreadsheetId());
  var rows = repo.getAll(DatabaseConfig.SHEETS.PEGAWAI);
  console.log('Jumlah baris pegawai: ' + rows.length);

  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var storedHash = String(r.password || '');
    console.log(
      '[' + i + '] username=' + r.username +
      ' | is_active=' + r.is_active +
      ' | password_awal=' + storedHash.substring(0, 12) + '...'
    );
  }

  // Cek user admin
  var admin = AuthRepository.findByUsername('admin');
  if (!admin) {
    console.log('>> admin TIDAK ditemukan di sheet pegawai');
    return false;
  }
  console.log('>> admin DITEMUKAN');

  var storedPassword = String(admin.password);
  var computedHash = AuthService.hashPassword('Admin123!');
  console.log('Stored hash   : ' + storedPassword);
  console.log('Computed hash : ' + computedHash);
  console.log('Cocok: ' + (storedPassword === computedHash));

  return storedPassword === computedHash;
}
