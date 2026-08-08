/**
 * PenerimaanService.gs
 *
 * Service untuk business logic konfirmasi penerimaan.
 *
 * Business Rules (Docs/02B-Business-Rules-Catalog.md):
 * - BR-RCV-001: Penerimaan hanya dapat dilakukan satu kali.
 * - BR-RCV-002: Penerima wajib mengisi identitas sesuai formulir.
 * - BR-RCV-003: Tanda tangan digital wajib tersedia.
 * - BR-RCV-004: Foto penerima wajib diambil.
 * - BR-RCV-005: GPS dapat diatur wajib/opsional melalui konfigurasi.
 * - BR-RCV-006: Setelah diterima, status surat menjadi Diterima.
 */

var PenerimaanService = (function () {
  var MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

  /**
   * Membersihkan prefix data URL dari base64
   * Contoh: "data:image/png;base64,iVBOR..." -> "iVBOR..."
   * @param {string} base64 - Data base64 (mungkin dengan prefix)
   * @returns {string} Base64 bersih
   */
  function cleanBase64(base64) {
    if (!base64) return '';
    if (base64.indexOf('base64,') !== -1) {
      return base64.substring(base64.indexOf('base64,') + 7);
    }
    return base64;
  }

  /**
   * Validasi data gambar base64
   * @param {string} base64Data - Data gambar
   * @param {string} fieldName - Nama field untuk pesan error
   * @returns {string} Base64 bersih
   * @throws {ValidationError}
   */
  function validateImage(base64Data, fieldName) {
    if (!base64Data) {
      throw new ValidationError(fieldName + ' wajib diisi', [
        { field: fieldName, message: fieldName + ' wajib diisi' },
      ]);
    }
    var clean = cleanBase64(base64Data);
    var estimatedSize = Math.floor((clean.length * 3) / 4);
    if (estimatedSize > MAX_IMAGE_SIZE_BYTES) {
      throw new ValidationError('Ukuran gambar maksimal 5 MB', [
        { field: fieldName, message: 'Ukuran gambar maksimal 5 MB' },
      ]);
    }
    return clean;
  }

  /**
   * Mendapatkan status GPS dari konfigurasi
   * @returns {boolean} true jika GPS wajib
   */
  function isGpsRequired() {
    var config = DatabaseConfig.getAppConfig();
    return String(config.gps_enabled || 'true') === 'true';
  }

  /**
   * Membuat konfirmasi penerimaan
   * @param {object} data - { ekspedisiId, namaPenerima, jabatan, instansi, foto, signature, gpsLat, gpsLng }
   * @param {object} user - User yang melakukan konfirmasi
   * @returns {object} Data penerimaan yang disimpan
   */
  function create(data, user) {
    var errors = [];
    if (!data.ekspedisiId) {
      errors.push({ field: 'ekspedisiId', message: 'Ekspedisi wajib diisi' });
    }
    if (!data.namaPenerima || String(data.namaPenerima).trim() === '') {
      errors.push({ field: 'namaPenerima', message: 'Nama penerima wajib diisi' });
    }
    if (!data.jabatan || String(data.jabatan).trim() === '') {
      errors.push({ field: 'jabatan', message: 'Jabatan wajib diisi' });
    }
    if (!data.instansi || String(data.instansi).trim() === '') {
      errors.push({ field: 'instansi', message: 'Instansi wajib diisi' });
    }
    if (!data.foto) {
      errors.push({ field: 'foto', message: 'Foto penerima wajib diambil' });
    }
    if (!data.signature) {
      errors.push({ field: 'signature', message: 'Tanda tangan wajib diisi' });
    }

    var gpsRequired = isGpsRequired();
    if (gpsRequired && (data.gpsLat === undefined || data.gpsLng === undefined)) {
      errors.push({ field: 'gps', message: 'Lokasi GPS wajib diisi' });
    }

    if (errors.length > 0) {
      throw new ValidationError('Validasi gagal', errors);
    }

    // BR-RCV-001: Cek ekspedisi ada
    var ekspedisi = EkspedisiRepository.findById(data.ekspedisiId);
    if (!ekspedisi) {
      throw new NotFoundError('Ekspedisi tidak ditemukan');
    }

    // BR-RCV-001: Cek belum pernah dikonfirmasi
    var existing = PenerimaanRepository.findByEkspedisiId(ekspedisi.id);
    if (existing) {
      throw new ConflictError('Surat sudah diterima', 'E003');
    }

    // Upload foto
    var fotoBase64 = validateImage(data.foto, 'foto');
    var fotoFile = DriveRepository.uploadFoto(
      fotoBase64,
      'Foto-' + ekspedisi.nomor_ekspedisi + '.png'
    );

    // Upload signature
    var signatureBase64 = validateImage(data.signature, 'signature');
    var signatureFile = DriveRepository.uploadSignature(
      signatureBase64,
      'Signature-' + ekspedisi.nomor_ekspedisi + '.png'
    );

    // Simpan penerimaan
    var penerimaanData = {
      ekspedisi_id: ekspedisi.id,
      nama_penerima: data.namaPenerima,
      jabatan: data.jabatan,
      instansi: data.instansi,
      foto_url: fotoFile.id,
      signature_url: signatureFile.id,
      gps_lat: data.gpsLat !== undefined ? data.gpsLat : '',
      gps_lng: data.gpsLng !== undefined ? data.gpsLng : '',
      created_by: user ? user.username : 'system',
    };
    var penerimaan = PenerimaanRepository.insert(penerimaanData);

    // BR-RCV-006: Update status surat menjadi Diterima
    SuratService.updateStatus(ekspedisi.surat_id, 'diterima');

    var username = user ? user.username : 'system';
    AuditService.log(username, 'CONFIRM_PENERIMAAN', 'penerimaan', 'Success', ekspedisi.surat_id);

    // BR-DOC-002: Generate PDF bukti penerimaan otomatis
    try {
      var surat = SuratRepository.findById(ekspedisi.surat_id);
      var pdfResult = PdfService.generateBuktiPenerimaan(penerimaan, surat, ekspedisi);
      PenerimaanRepository.update(penerimaan.id, { pdf_bukti: pdfResult.id });
      AuditService.log(username, 'GENERATE_PDF', 'penerimaan', 'Success', ekspedisi.surat_id);
      penerimaan.pdf_bukti = pdfResult.id;
    } catch (e) {
      Logger.error('PenerimaanService', 'Gagal generate PDF bukti penerimaan', e.message);
      AuditService.log(username, 'GENERATE_PDF', 'penerimaan', 'Fail', ekspedisi.surat_id);
      // PDF gagal tidak membatalkan penerimaan — ditandai untuk retry manual
    }

    return penerimaan;
  }

  /**
   * Mendapatkan detail penerimaan
   * @param {string} id - UUID penerimaan
   * @returns {object} Data penerimaan
   * @throws {NotFoundError}
   */
  function getById(id) {
    var penerimaan = PenerimaanRepository.findById(id);
    if (!penerimaan) {
      throw new NotFoundError('Penerimaan tidak ditemukan');
    }
    return penerimaan;
  }

  /**
   * Mendapatkan penerimaan berdasarkan ekspedisi (untuk verifikasi QR)
   * @param {string} ekspedisiId - UUID ekspedisi
   * @returns {object|null}
   */
  function getByEkspedisiId(ekspedisiId) {
    return PenerimaanRepository.findByEkspedisiId(ekspedisiId);
  }

  return {
    create: create,
    getById: getById,
    getByEkspedisiId: getByEkspedisiId,
    isGpsRequired: isGpsRequired,
    cleanBase64: cleanBase64,
  };
})();
