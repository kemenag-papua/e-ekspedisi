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
 * Idempotent: jika dijalankan ulang, akan memakai Spreadsheet yang sama
 * (tidak membuat Spreadsheet baru lagi).
 * @returns {string} Spreadsheet ID
 */
function setupDatabase() {
  var props = PropertiesService.getScriptProperties();

  // 1. Gunakan Spreadsheet yang sudah ada jika pernah dibuat
  var ss = null;
  var existingId = props.getProperty('SPREADSHEET_ID');
  if (existingId) {
    try {
      ss = SpreadsheetApp.openById(existingId);
      Logger.log('==> Memakai Spreadsheet yang sudah ada: ' + ss.getUrl());
    } catch (e) {
      Logger.log('==> Spreadsheet tersimpan tidak ditemukan, cari alternatif...');
      ss = null;
    }
  }
  if (!ss) {
    // 1b. Reuse Spreadsheet hasil run sebelumnya yang gagal (agar tidak duplikat)
    var candidates = DriveApp.getFilesByName('e-Ekspedisi - Database');
    if (candidates.hasNext()) {
      var existingFile = candidates.next();
      ss = SpreadsheetApp.openById(existingFile.getId());
      Logger.log('==> Memakai Spreadsheet hasil run sebelumnya: ' + ss.getUrl());
    }
  }
  if (!ss) {
    ss = SpreadsheetApp.create('e-Ekspedisi - Database');
    Logger.log('==> Spreadsheet baru dibuat: ' + ss.getUrl());
  }
  var spreadsheetId = ss.getId();
  var scriptUrl = ScriptApp.getService().getUrl();

  // 2. Buat 8 sheet dengan header
  // CATATAN: sheet default "Sheet1" TIDAK dihapus di sini.
  // Apps Script tidak mengizinkan menghapus semua sheet dalam dokumen,
  // sehingga Sheet1 dihapus TERAKHIR setelah sheet lain dibuat.
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

  // 2b. Hapus sheet default (Sheet1/dll) SETELAH sheet lain dibuat.
  // Guard: hanya hapus jika jumlah sheet lebih dari 1.
  var defaultSheets = ss.getSheets().filter(function (s) {
    return (
      s.getName() === 'Sheet1' ||
      s.getName() === 'Sheet2' ||
      s.getName() === 'Sheet3'
    );
  });
  for (var d = 0; d < defaultSheets.length; d++) {
    if (ss.getSheets().length > 1) {
      ss.deleteSheet(defaultSheets[d]);
    }
  }

  // 4. Seed master_unit (hanya jika sheet masih kosong, agar idempotent)
  var now = new Date();
  if (ss.getSheetByName('master_unit').getLastRow() <= 1) {
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
  } else {
    Logger.log('==> master_unit sudah berisi data, lewati seed.');
  }

  // 5. Seed super admin (username: admin, password: Admin123!)
  // Hanya jika sheet pegawai masih kosong (idempotent)
  if (ss.getSheetByName('pegawai').getLastRow() <= 1) {
    var adminPassword = 'Admin123!';
    var adminRows = [[
      Utilities.getUuid(),
      'Administrator',
      'admin',
      hashPassword(adminPassword),
      'super_admin',
      unitIds ? unitIds.sekretariat : '',
      '',
      '',
      'true',
      now,
      now,
    ]];
    ss.getSheetByName('pegawai').getRange(2, 1, 1, 11).setValues(adminRows);
  } else {
    var adminPassword = '(tidak diubah - pegawai sudah ada)';
    Logger.log('==> pegawai sudah berisi data, lewati seed admin.');
  }

  // 6. Seed konfigurasi (hanya jika kosong)
  if (ss.getSheetByName('konfigurasi').getLastRow() <= 1) {
    var configRows = [
      ['gps_enabled', 'true', 'GPS wajib pada konfirmasi penerimaan'],
      ['max_upload_mb', '5', 'Batas maksimal ukuran file upload (MB)'],
      ['nama_instansi', 'Instansi Pemerintah', 'Nama instansi untuk bukti penerimaan'],
      ['app_url', '', 'URL aplikasi frontend untuk QR verifikasi (contoh: https://app.instansi.go.id)'],
    ];
    ss.getSheetByName('konfigurasi').getRange(2, 1, configRows.length, 3).setValues(configRows);
  } else {
    Logger.log('==> konfigurasi sudah berisi data, lewati seed.');
  }

  // 7. Buat folder di Google Drive
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
  props.setProperty('SPREADSHEET_ID', spreadsheetId);
  props.setProperty('GPS_ENABLED', 'true');

  Logger.log('==> Setup selesai!');
  Logger.log('SPREADSHEET_ID = ' + spreadsheetId);
  Logger.log('URL Spreadsheet = ' + ss.getUrl());
  Logger.log('Username admin = admin');
  Logger.log('Password admin = ' + adminPassword);
  Logger.log('Script URL = ' + scriptUrl);
  Logger.log('==> PENTING: Bagikan Spreadsheet ke seluruh pengguna aplikasi');
  Logger.log('    (Drive -> Share -> tambahkan email pengguna sebagai Editor),');
  Logger.log('    karena web app berjalan sebagai user yang mengakses.');

  Logger.log('==> SALIN SPREADSHEET_ID di atas ke backend-gas/config/DatabaseConfig.gs');

  return spreadsheetId;
}

/**
 * Tes koneksi ke spreadsheet yang sudah dikonfigurasi
 * @returns {boolean}
 */
function testDatabaseConnection() {  var props = PropertiesService.getScriptProperties();
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

/**
 * Atur URL aplikasi frontend untuk QR verifikasi di PDF.
 * Jalankan setelah setupDatabase() dan setelah frontend di-deploy.
 * Contoh: updateAppUrl('https://app.instansi.go.id')
 * @param {string} url - URL frontend
 */
function updateAppUrl(url) {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SPREADSHEET_ID');
  if (!id) {
    Logger.log('SPREADSHEET_ID belum di-set. Jalankan setupDatabase() terlebih dahulu.');
    return;
  }
  var ss = SpreadsheetApp.openById(id);
  var sheet = ss.getSheetByName('konfigurasi');
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var data = sheet.getDataRange().getValues();
  var found = false;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === 'app_url') {
      sheet.getRange(i + 1, 2).setValue(url);
      found = true;
      break;
    }
  }
  if (!found) {
    sheet.appendRow(['app_url', url, 'URL aplikasi frontend untuk QR verifikasi']);
  }
  Logger.log('==> app_url di-set ke: ' + url);
}
