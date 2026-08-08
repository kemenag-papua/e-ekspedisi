/**
 * seed-test-data.gs
 *
 * Script STANDALONE untuk mengisi data uji (test data) untuk UAT.
 * HANYA untuk development/testing, JANGAN dijalankan di production.
 *
 * Cara menjalankan:
 * 1. Jalankan setupDatabase() terlebih dahulu
 * 2. Tempel script ini di project GAS yang sama
 * 3. Pilih fungsi `seedTestData` lalu klik Run
 *
 * Data yang di-seed (idempotent - hanya jika sheet kosong):
 * - 3 unit kerja
 * - 3 pegawai (admin, admin persuratan, pimpinan)
 * - 5 surat keluar contoh + ekspedisi
 * - 2 penerimaan (untuk surat yang sudah diterima)
 */

var SALT = 'e-ekspedisi-salt-2026';

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

function getSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SPREADSHEET_ID');
  if (!id) {
    Logger.log('SPREADSHEET_ID belum di-set. Jalankan setupDatabase() terlebih dahulu.');
    return null;
  }
  return SpreadsheetApp.openById(id);
}

function fmt(d) {
  return Utilities.formatDate(d, 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');
}

/**
 * Seed data uji untuk UAT
 */
function seedTestData() {
  var ss = getSpreadsheet();
  if (!ss) return;

  var now = new Date();
  var unitIds = {};

  // 1. Seed unit kerja (jika kosong)
  var unitSheet = ss.getSheetByName('master_unit');
  if (unitSheet.getLastRow() <= 1) {
    var units = [
      ['Sekretariat', 'Unit kesekretariatan'],
      ['Bagian Umum', 'Unit pelayanan umum'],
      ['Bagian Keuangan', 'Unit pengelolaan keuangan'],
    ];
    var unitRows = [];
    for (var u = 0; u < units.length; u++) {
      var uid = Utilities.getUuid();
      unitIds[units[u][0]] = uid;
      unitRows.push([uid, units[u][0], units[u][1], now, now]);
    }
    unitSheet.getRange(2, 1, unitRows.length, 5).setValues(unitRows);
    Logger.log('==> Seeded ' + unitRows.length + ' unit kerja');
  } else {
    // Baca unit yang sudah ada
    var unitData = unitSheet.getDataRange().getValues();
    for (var i = 1; i < unitData.length; i++) {
      unitIds[unitData[i][1]] = unitData[i][0];
    }
    Logger.log('==> Unit sudah ada, lewati seed.');
  }

  var sekretariat = unitIds['Sekretariat'] || unitIds[Object.keys(unitIds)[0]];

  // 2. Seed pegawai (jika kosong)
  var pegawaiSheet = ss.getSheetByName('pegawai');
  if (pegawaiSheet.getLastRow() <= 1) {
    var pegawaiRows = [
      [
        Utilities.getUuid(), 'Administrator', 'admin', hashPassword('Admin123!'),
        'super_admin', sekretariat, '', 'admin@instansi.go.id', 'true', now, now,
      ],
      [
        Utilities.getUuid(), 'Admin Persuratan', 'adminpersuratan', hashPassword('Admin123!'),
        'admin', sekretariat, '', 'persuratan@instansi.go.id', 'true', now, now,
      ],
      [
        Utilities.getUuid(), 'Kepala Instansi', 'pimpinan', hashPassword('Admin123!'),
        'pimpinan', sekretariat, '', 'kepala@instansi.go.id', 'true', now, now,
      ],
    ];
    pegawaiSheet.getRange(2, 1, pegawaiRows.length, 11).setValues(pegawaiRows);
    Logger.log('==> Seeded 3 pegawai (admin, adminpersuratan, pimpinan) - password: Admin123!');
  } else {
    Logger.log('==> Pegawai sudah ada, lewati seed.');
  }

  // 3. Seed surat keluar + ekspedisi (jika kosong)
  var suratSheet = ss.getSheetByName('surat_keluar');
  if (suratSheet.getLastRow() > 1) {
    Logger.log('==> Surat sudah ada, lewati seed.');
    return;
  }

  var ekspedisiSheet = ss.getSheetByName('ekspedisi');
  var penerimaanSheet = ss.getSheetByName('penerimaan');

  var contohSurat = [
    { nomor: 'B-001/KUM/2026', tanggal: '2026-08-01', perihal: 'Undangan Rapat Koordinasi', status: 'menunggu_pengambilan' },
    { nomor: 'B-002/KUM/2026', tanggal: '2026-08-02', perihal: 'Nota Dinas Penyesuaian Anggaran', status: 'menunggu_pengambilan' },
    { nomor: 'B-003/KUM/2026', tanggal: '2026-08-03', perihal: 'Surat Keputusan Pegawai', status: 'menunggu_pengambilan' },
    { nomor: 'B-004/KUM/2026', tanggal: '2026-08-04', perihal: 'Surat Edaran Disiplin', status: 'diterima' },
    { nomor: 'B-005/KUM/2026', tanggal: '2026-08-05', perihal: 'Permohonan Data Kepegawaian', status: 'diterima' },
  ];

  for (var s = 0; s < contohSurat.length; s++) {
    var cs = contohSurat[s];
    var suratId = Utilities.getUuid();
    var ekspedisiId = Utilities.getUuid();
    var nomorEkspedisi = 'EXP-2026-' + ('000000' + (s + 1)).slice(-6);
    var createdAt = new Date(2026, 7, s + 1, 9, 0, 0); // 1-5 Agustus 2026

    // Insert surat
    suratSheet.appendRow([
      suratId, cs.nomor, cs.tanggal, cs.perihal, sekretariat,
      '', cs.status, 'admin', fmt(createdAt), fmt(createdAt),
    ]);

    // Insert ekspedisi
    ekspedisiSheet.appendRow([
      ekspedisiId, nomorEkspedisi, suratId,
      Utilities.getUuid().replace(/-/g, ''), '',
    ]);

    // Untuk surat yang diterima, seed penerimaan
    if (cs.status === 'diterima') {
      penerimaanSheet.appendRow([
        Utilities.getUuid(), ekspedisiId, 'Budi Santoso', 'Analis', 'Kementerian Agama',
        '', '', '-6.2088', '106.8456', '',
        fmt(new Date(2026, 7, s + 1, 14, 30, 0)), 'admin',
      ]);
    }
  }

  Logger.log('==> Seeded ' + contohSurat.length + ' surat + ekspedisi + 2 penerimaan');
  Logger.log('==> Seed selesai. Data uji siap untuk UAT.');
  Logger.log('    Akun uji:');
  Logger.log('    - admin / Admin123! (Super Admin)');
  Logger.log('    - adminpersuratan / Admin123! (Admin)');
  Logger.log('    - pimpinan / Admin123! (Pimpinan)');
}
