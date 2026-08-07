/**
 * SuratService.gs
 *
 * Service untuk business logic surat keluar.
 *
 * Business Rules yang diterapkan:
 * - Nomor surat wajib unik.
 * - Perihal maksimal 255 karakter.
 * - File wajib PDF dan ukuran maksimal 5 MB.
 * - Setiap surat wajib memiliki nomor ekspedisi otomatis (BR-EXP-001).
 * - Status awal surat adalah Menunggu Pengambilan (BR-EXP-004).
 * - Edit dibatasi oleh status: draft semua field, menunggu_pengambilan hanya perihal.
 */

var SuratService = (function () {
  var MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
  var STATUS_MENUNGGU = 'menunggu_pengambilan';
  var STATUS_DITERIMA = 'diterima';

  /**
   * Mendapatkan seluruh surat keluar dengan informasi unit dan ekspedisi
   * @param {object} filters - { search, status }
   * @returns {Array} Daftar surat
   */
  function getAll(filters) {
    var surats = SuratRepository.getAll();
    var units = MasterUnitRepository.getAll();
    var ekspedisiList = EkspedisiRepository.getAll();

    var result = surats.map(function (surat) {
      return enrichSurat(surat, units, ekspedisiList);
    });

    if (filters) {
      if (filters.status) {
        result = result.filter(function (s) {
          return s.status === filters.status;
        });
      }
      if (filters.search) {
        var q = String(filters.search).toLowerCase();
        result = result.filter(function (s) {
          return (
            String(s.nomor_surat).toLowerCase().indexOf(q) !== -1 ||
            String(s.perihal).toLowerCase().indexOf(q) !== -1 ||
            String(s.nomor_ekspedisi || '').toLowerCase().indexOf(q) !== -1
          );
        });
      }
    }

    // Urutkan berdasarkan created_at terbaru
    result.sort(function (a, b) {
      return String(b.created_at).localeCompare(String(a.created_at));
    });

    return result;
  }

  /**
   * Mendapatkan detail surat
   * @param {string} id - UUID surat
   * @returns {object} Surat lengkap
   * @throws {NotFoundError}
   */
  function getById(id) {
    var surat = SuratRepository.findById(id);
    if (!surat) {
      throw new NotFoundError('Surat tidak ditemukan');
    }
    var units = MasterUnitRepository.getAll();
    var ekspedisiList = EkspedisiRepository.getAll();
    return enrichSurat(surat, units, ekspedisiList);
  }

  /**
   * Melengkapi data surat dengan nama unit dan nomor ekspedisi
   * @param {object} surat - Data surat dari DB
   * @param {Array} units - Daftar unit
   * @param {Array} ekspedisiList - Daftar ekspedisi
   * @returns {object} Surat yang diperkaya
   */
  function enrichSurat(surat, units, ekspedisiList) {
    var result = {};
    for (var key in surat) {
      result[key] = surat[key];
    }
    var unit = units.filter(function (u) {
      return u.id === surat.unit_id;
    })[0];
    result.nama_unit = unit ? unit.nama : '';
    result.unit_name = unit ? unit.nama : '';

    var ekspedisi = ekspedisiList.filter(function (e) {
      return e.surat_id === surat.id;
    })[0];
    result.nomor_ekspedisi = ekspedisi ? ekspedisi.nomor_ekspedisi : '';
    result.ekspedisi_id = ekspedisi ? ekspedisi.id : '';
    result.qr_token = ekspedisi ? ekspedisi.qr_token : '';
    return result;
  }

  /**
   * Validasi base64 PDF
   * @param {string} fileBase64 - Data file dalam base64
   * @returns {object} { data, name }
   * @throws {ValidationError}
   */
  function validatePdf(fileBase64) {
    if (!fileBase64) {
      throw new ValidationError('File PDF wajib diunggah', [
        { field: 'file_pdf', message: 'File PDF wajib diunggah' },
      ]);
    }

    // Hapus prefix data URL jika ada (data:application/pdf;base64,)
    var base64 = fileBase64;
    if (base64.indexOf('base64,') !== -1) {
      base64 = base64.substring(base64.indexOf('base64,') + 7);
    }

    // Estimasi ukuran dari panjang base64
    var estimatedSize = Math.floor((base64.length * 3) / 4);
    if (estimatedSize > MAX_FILE_SIZE_BYTES) {
      throw new ValidationError('Ukuran file maksimal 5 MB', [
        { field: 'file_pdf', message: 'Ukuran file maksimal 5 MB' },
      ]);
    }

    var bytes;
    try {
      bytes = Utilities.base64Decode(base64);
    } catch (e) {
      throw new ValidationError('File tidak valid', [
        { field: 'file_pdf', message: 'Data file tidak valid' },
      ]);
    }

    // Cek magic bytes PDF (%PDF)
    var isPdf =
      bytes.length >= 4 &&
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46;

    if (!isPdf) {
      throw new ValidationError('File harus berformat PDF', [
        { field: 'file_pdf', message: 'File harus berformat PDF' },
      ]);
    }

    return { data: base64 };
  }

  /**
   * Membuat surat keluar baru (termasuk ekspedisi otomatis)
   * @param {object} data - Data surat
   * @param {object} user - User yang membuat
   * @returns {object} { surat, ekspedisi }
   */
  function create(data, user) {
    var errors = [];
    if (!data.nomor_surat || String(data.nomor_surat).trim() === '') {
      errors.push({ field: 'nomor_surat', message: 'Nomor surat wajib diisi' });
    }
    if (!data.tanggal_surat) {
      errors.push({ field: 'tanggal_surat', message: 'Tanggal surat wajib diisi' });
    }
    if (!data.perihal || String(data.perihal).trim() === '') {
      errors.push({ field: 'perihal', message: 'Perihal wajib diisi' });
    } else if (String(data.perihal).length > 255) {
      errors.push({ field: 'perihal', message: 'Perihal maksimal 255 karakter' });
    }
    if (!data.unit_id) {
      errors.push({ field: 'unit_id', message: 'Unit wajib diisi' });
    }
    if (errors.length > 0) {
      throw new ValidationError('Validasi gagal', errors);
    }

    // Cek duplikasi nomor surat
    var existing = SuratRepository.findByNomor(data.nomor_surat);
    if (existing) {
      throw new ConflictError('Nomor surat sudah digunakan', 'E001');
    }

    // Cek unit valid
    var unit = MasterUnitRepository.findById(data.unit_id);
    if (!unit) {
      throw new NotFoundError('Unit tidak ditemukan');
    }

    // Upload PDF
    var validatedFile = validatePdf(data.file_pdf);
    var fileName = 'Surat-' + data.nomor_surat.replace(/[\\/:*?"<>|]/g, '-') + '.pdf';
    var uploadedFile = DriveRepository.uploadPdf(validatedFile.data, fileName);

    // Insert surat
    var suratData = {
      nomor_surat: data.nomor_surat,
      tanggal_surat: data.tanggal_surat,
      perihal: data.perihal,
      unit_id: data.unit_id,
      file_pdf: uploadedFile.id,
      status: STATUS_MENUNGGU,
      created_by: user ? user.id : '',
    };
    var surat = SuratRepository.insert(suratData);

    // Generate ekspedisi otomatis
    var ekspedisi = EkspedisiService.createForSurat(surat.id);

    var username = user ? user.username : 'system';
    AuditService.log(username, 'CREATE_SURAT', 'surat_keluar', 'Success', surat.id);
    AuditService.log(username, 'CREATE_EKSPEDISI', 'ekspedisi', 'Success', surat.id);

    return {
      surat: enrichSurat(surat, [unit], [ekspedisi]),
      ekspedisi: ekspedisi,
    };
  }

  /**
   * Memperbarui surat (dibatasi sesuai status)
   * @param {string} id - UUID surat
   * @param {object} data - Data yang diperbarui
   * @param {object} user - User yang mengubah
   * @returns {object} Surat yang diperbarui
   */
  function update(id, data, user) {
    var surat = getById(id);

    if (surat.status === STATUS_DITERIMA) {
      throw new ConflictError('Surat sudah diterima, tidak dapat diubah');
    }

    // Jika sudah menunggu pengambilan, hanya perihal yang boleh diubah
    if (surat.status === STATUS_MENUNGGU) {
      if (data.nomor_surat || data.tanggal_surat || data.unit_id || data.file_pdf) {
        throw new ConflictError('Surat sudah memiliki ekspedisi. Hanya perihal yang dapat diubah');
      }
    }

    // Cek duplikasi nomor surat jika diubah
    if (data.nomor_surat) {
      var existing = SuratRepository.findByNomor(data.nomor_surat);
      if (existing && existing.id !== id) {
        throw new ConflictError('Nomor surat sudah digunakan', 'E001');
      }
    }

    // Jika ada file baru, upload
    var updateData = {};
    for (var key in data) {
      if (key === 'file_pdf' && data.file_pdf) {
        var validatedFile = validatePdf(data.file_pdf);
        var fileName = 'Surat-' + data.nomor_surat.replace(/[\\/:*?"<>|]/g, '-') + '.pdf';
        var uploadedFile = DriveRepository.uploadPdf(validatedFile.data, fileName);
        updateData.file_pdf = uploadedFile.id;
      } else if (key !== 'file_pdf' && key !== 'status' && key !== 'created_by') {
        updateData[key] = data[key];
      }
    }

    var updated = SuratRepository.update(id, updateData);
    var username = user ? user.username : 'system';
    AuditService.log(username, 'UPDATE_SURAT', 'surat_keluar', 'Success', id);
    return getById(id);
  }

  /**
   * Menghapus surat
   * @param {string} id - UUID surat
   * @param {object} user - User yang menghapus
   * @returns {boolean}
   */
  function remove(id, user) {
    var surat = getById(id);

    // Hapus ekspedisi terkait
    var ekspedisi = EkspedisiRepository.findBySuratId(id);
    if (ekspedisi) {
      EkspedisiRepository.remove(ekspedisi.id);
    }

    // Hapus file dari Drive
    if (surat.file_pdf) {
      DriveRepository.deleteFile(surat.file_pdf);
    }

    var username = user ? user.username : 'system';
    AuditService.log(username, 'DELETE_SURAT', 'surat_keluar', 'Success', id);
    return SuratRepository.remove(id);
  }

  return {
    getAll: getAll,
    getById: getById,
    create: create,
    update: update,
    remove: remove,
    validatePdf: validatePdf,
    MAX_FILE_SIZE_BYTES: MAX_FILE_SIZE_BYTES,
  };
})();
