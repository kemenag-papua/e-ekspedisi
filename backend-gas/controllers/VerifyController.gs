/**
 * VerifyController.gs
 *
 * Controller untuk endpoint verifikasi QR (publik, tanpa login).
 * Dipanggil saat penerima memindai QR Code untuk melihat status surat.
 *
 * Endpoint:
 * - GET /api/v1/verify/:id?token={qr_token}
 */

var VerifyController = (function () {
  /**
   * GET /api/v1/verify/{ekspedisiId}?token={qr_token}
   * Publik - tidak memerlukan autentikasi
   */
  function verify(parsed) {
    var ekspedisiId = parsed.params.id;
    var token = parsed.query.token || '';

    if (!ekspedisiId || !token) {
      return BaseController.sendJson(
        ResponseHelper.error('Parameter tidak lengkap', 400, [
          { field: 'token', message: 'Token verifikasi wajib diisi' },
        ])
      );
    }

    // Validasi ekspedisi
    var ekspedisi = EkspedisiRepository.findById(ekspedisiId);
    if (!ekspedisi) {
      return BaseController.sendError(ResponseHelper.notFound('Ekspedisi'));
    }

    // Validasi token QR (BR-QR-002)
    if (String(ekspedisi.qr_token) !== String(token)) {
      return BaseController.sendError(
        ResponseHelper.error('QR tidak valid', 400, [{ field: 'token', message: 'Token QR tidak valid' }])
      );
    }

    // Ambil data surat
    var surat = SuratRepository.findById(ekspedisi.surat_id);
    if (!surat) {
      return BaseController.sendError(ResponseHelper.notFound('Surat'));
    }

    // Cek apakah sudah diterima
    var penerimaan = PenerimaanRepository.findByEkspedisiId(ekspedisi.id);

    var data = {
      ekspedisiId: ekspedisi.id,
      nomorEkspedisi: ekspedisi.nomor_ekspedisi,
      surat: {
        id: surat.id,
        nomorSurat: surat.nomor_surat,
        perihal: surat.perihal,
        tanggalSurat: surat.tanggal_surat,
        status: surat.status,
      },
      sudahDiterima: Boolean(penerimaan),
      penerimaan: penerimaan || null,
    };

    return BaseController.sendSuccess(data, 'Verifikasi berhasil');
  }

  /**
   * Registrasi route verifikasi
   */
  function registerRoutes() {
    Router.add('GET', '/api/v1/verify/:id', verify);
  }

  return {
    verify: verify,
    registerRoutes: registerRoutes,
  };
})();
