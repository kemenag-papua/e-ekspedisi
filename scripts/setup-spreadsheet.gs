/**
 * setup-spreadsheet.gs
 *
 * Script STANDALONE untuk setup database e-Ekspedisi.
 * Jalankan sekali di Google Apps Script Editor (dengan akun Google Workspace instansi).
 *
 * Cara menjalankan:
 * 1. Buka https://script.google.com -> New Project
 * 2. Tempel seluruh isi file ini
 * 3. Pilih fungsi `setupDatabase` lalu klik Run
 * 4. Otorisasi akses (Spreadsheet, Drive, Script Properties)
 * 5. Catat Spreadsheet ID dari log, masukkan ke backend-gas/config/DatabaseConfig.gs
 *
 * Yang dilakukan:
 * - Membuat Spreadsheet baru dengan 8 sheet
 * - Mengisi header sesuai data dictionary
 * - Seed data: 1 Super Admin, 3 unit kerja, konfigurasi default
 * - Membuat folder Google Drive (e-Ekspedisi/...)
 * - Menyimpan konfigurasi di Script Properties
 */

var SALT = 'e-ekspedisi-salt-2026';

/**
 * Hash password dengan SHA-256 (sama dengan backend)
 * @param {string} password - Password plain
 * @returns {string} Hash hex
 */
function hashPassword(password) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    SALT + password,
    Utilities.Charset.UTF_8
  );
  return bytes
    .map(function (byte) {
      var val = byte & 0xff;
      return (val < 16 ? '0' : '') + val.toString(16);
    })
    .join('');
}

/**
 * Membuat sheet jika belum ada dan mengisi header
 * @param {SpreadsheetApp.Spreadsheet} ss - Spreadsheet
 * @param {string} name - Nama sheet
 * @param {Array} headers - Header kolom
 */
function ensureSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
}

/**
 * Main setup function
 * @returns {string} Spreadsheet ID
 */
function setupDatabase() {
  // 1. Buat Spreadsheet baru
  var ss = SpreadsheetApp.create('e-Ekspedisi - Database');
  var spreadsheetId = ss.getId();
  var scriptUrl = ScriptApp.getService().getUrl();

  Logger.log('==> Spreadsheet dibuat: ' + ss.getUrl());

  // 2. Hapus sheet default (Sheet1)
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet) {
    ss.deleteSheet(defaultSheet);
  }

  // 3. Buat 8 sheet dengan header
  ensureSheet(ss, 'surat_keluar', [
    'id', 'nomor_surat', 'tanggal_surat', 'perihal', 'unit_id',
    'file_pdf', 'status', 'created_by', 'created_at', 'updated_at',
  ]);
  ensureSheet(ss, 'ekspedisi', [
    'id', 'nomor_ekspedisi', 'surat_id', 'qr_token', 'qr_url',
  ]);
  ensureSheet(ss, 'penerimaan', [
    'id', 'ekspedisi_id', 'nama_penerima', 'jabatan', 'instansi',
    'foto_url', 'signature_url', 'gps_lat', 'gps_lng', 'pdf_bukti',
    'diterima_pada', 'created_by',
  ]);
  ensureSheet(ss, 'pegawai', [
    'id', 'nama', 'username', 'password', 'role',
    'unit_id', 'no_hp', 'email', 'is_active', 'created_at', 'updated_at',
  ]);
  ensureSheet(ss, 'master_unit', [
    'id', 'nama', 'keterangan', 'created_at', 'updated_at',
  ]);
  ensureSheet(ss, 'konfigurasi', ['key', 'value', 'keterangan']);
  ensureSheet(ss, 'audit_log', [
    'id', 'user', 'aksi', 'objek', 'objek_id', 'hasil', 'waktu',
  ]);
  ensureSheet(ss, 'session', [
    'id', 'user_id', 'token', 'created_at', 'expires_at', 'is_active',
  ]);

  // 4. Seed master_unit
  var now = new Date();
  var unitIds = {
    sekretariat: Utilities.getUuid(),
    umum: Utilities.getUuid(),
    keuangan: Utilities.getUuid(),
  };
  var unitRows = [
    [unitIds.sekretariat, 'Sekretariat', 'Unit kesekretariatan', now, now],
    [unitIds.umum, 'Bagian Umum', 'Unit pelayanan umum', now, now],
    [unitIds.keuangan, 'Bagian Keuangan', 'Unit pengelolaan keuangan', now, now],
  ];
  ss.getSheetByName('master_unit').getRange(2, 1, unitRows.length, 5).setValues(unitRows);

  // 5. Seed super admin (username: admin, password: Admin123!)
  var adminPassword = 'Admin123!';
  var adminRows = [[
    Utilities.getUuid(),
    'Administrator',
    'admin',
    hashPassword(adminPassword),
    'super_admin',
    unitIds.sekretariat,
    '',
    '',
    'true',
    now,
    now,
  ]];
  ss.getSheetByName('pegawai').getRange(2, 1, 1, 11).setValues(adminRows);

  // 6. Seed konfigurasi
  var configRows = [
    ['gps_enabled', 'true', 'GPS wajib pada konfirmasi penerimaan'],
    ['max_upload_mb', '5', 'Batas maksimal ukuran file upload (MB)'],
    ['nama_instansi', 'Instansi Pemerintah', 'Nama instansi untuk bukti penerimaan'],
  ];
  ss.getSheetByName('konfigurasi').getRange(2, 1, configRows.length, 3).setValues(configRows);

  // 7. Buat folder di Google Drive
  var rootFolder = DriveApp.getFolderById(DriveApp.getRootFolder().getId());
  var eeksFolder = DriveApp.getFoldersByName('e-Ekspedisi').hasNext()
    ? DriveApp.getFoldersByName('e-Ekspedisi').next()
    : DriveApp.createFolder('e-Ekspedisi');
  var folders = ['Surat', 'Bukti-Penerimaan', 'Foto', 'Signature', 'QR'];
  for (var i = 0; i < folders.length; i++) {
    if (!eeksFolder.getFoldersByName(folders[i]).hasNext()) {
      eeksFolder.createFolder(folders[i]);
    }
  }

  // 8. Simpan konfigurasi di Script Properties
  var props = PropertiesService.getScriptProperties();
  props.setProperty('SPREADSHEET_ID', spreadsheetId);
  props.setProperty('GPS_ENABLED', 'true');

  Logger.log('==> Setup selesai!');
  Logger.log('SPREADSHEET_ID = ' + spreadsheetId);
  Logger.log('URL Spreadsheet = ' + ss.getUrl());
  Logger.log('Username admin = admin');
  Logger.log('Password admin = ' + adminPassword);
  Logger.log('Script URL = ' + scriptUrl);

  Logger.log('==> SALIN SPREADSHEET_ID di atas ke backend-gas/config/DatabaseConfig.gs');

  return spreadsheetId;
}

/**
 * Tes koneksi ke spreadsheet yang sudah dikonfigurasi
 * @returns {boolean}
 */
function testDatabaseConnection() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SPREADSHEET_ID');
  if (!id) {
    Logger.log('SPREADSHEET_ID belum di-set. Jalankan setupDatabase() terlebih dahulu.');
    return false;
  }
  var ss = SpreadsheetApp.openById(id);
  var sheets = ss.getSheets().map(function (s) {
    return s.getName();
  });
  Logger.log('Spreadsheet: ' + ss.getName());
  Logger.log('Sheets: ' + sheets.join(', '));
  return true;
}
