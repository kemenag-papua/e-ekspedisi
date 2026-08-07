/**
 * EkspedisiService.gs
 *
 * Service untuk business logic ekspedisi.
 *
 * Business Rules (Docs/02B-Business-Rules-Catalog.md):
 * - BR-EXP-001: Setiap surat wajib memiliki Nomor Ekspedisi unik.
 * - BR-EXP-002: Satu Nomor Ekspedisi hanya untuk satu surat.
 * - BR-EXP-003: Nomor Ekspedisi dibuat otomatis dan tidak dapat diubah.
 * - BR-EXP-004: Status awal surat adalah Menunggu Pengambilan.
 */

var EkspedisiService = (function () {
  /**
   * Generate Nomor Ekspedisi dengan format EXP-YYYY-XXXXXX
   * - YYYY = tahun berjalan
   * - XXXXXX = auto-increment 6 digit
   * @returns {string} Contoh: EXP-2026-000001
   */
  function generateNomorEkspedisi() {
    var year = DateUtils.now().getFullYear();
    var count = EkspedisiRepository.countByYear(year) + 1;
    var seq = ('000000' + count).slice(-6);
    return 'EXP-' + year + '-' + seq;
  }

  /**
   * Generate token QR (acak dan tidak mudah ditebak)
   * @returns {string} Token QR
   */
  function generateQrToken() {
    return Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
  }

  /**
   * Membuat ekspedisi untuk surat
   * @param {string} suratId - UUID surat keluar
   * @returns {object} Ekspedisi yang dibuat
   */
  function createForSurat(suratId) {
    var existing = EkspedisiRepository.findBySuratId(suratId);
    if (existing) {
      throw new ConflictError('Surat sudah memiliki nomor ekspedisi');
    }

    var ekspedisiData = {
      surat_id: suratId,
      nomor_ekspedisi: generateNomorEkspedisi(),
      qr_token: generateQrToken(),
      qr_url: '',
    };
    return EkspedisiRepository.insert(ekspedisiData);
  }

  /**
   * Mendapatkan ekspedisi berdasarkan surat
   * @param {string} suratId - UUID surat
   * @returns {object} Ekspedisi
   * @throws {NotFoundError} Jika tidak ada
   */
  function getBySuratId(suratId) {
    var ekspedisi = EkspedisiRepository.findBySuratId(suratId);
    if (!ekspedisi) {
      throw new NotFoundError('Ekspedisi tidak ditemukan');
    }
    return ekspedisi;
  }

  /**
   * Mendapatkan ekspedisi berdasarkan ID
   * @param {string} id - UUID ekspedisi
   * @returns {object} Ekspedisi
   * @throws {NotFoundError} Jika tidak ada
   */
  function getById(id) {
    var ekspedisi = EkspedisiRepository.findById(id);
    if (!ekspedisi) {
      throw new NotFoundError('Ekspedisi tidak ditemukan');
    }
    return ekspedisi;
  }

  return {
    generateNomorEkspedisi: generateNomorEkspedisi,
    generateQrToken: generateQrToken,
    createForSurat: createForSurat,
    getBySuratId: getBySuratId,
    getById: getById,
  };
})();
