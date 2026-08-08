/**
 * TemplateHelper.gs
 *
 * Helper untuk membangun template HTML bukti penerimaan.
 * Template HTML ini kemudian dikonversi menjadi PDF oleh PdfService.
 *
 * Isi PDF (Docs/03A-Functional-Specification-Detail.md Modul 4):
 * - Nomor Ekspedisi
 * - Nomor Surat
 * - Identitas Penerima
 * - Foto
 * - Tanda Tangan
 * - Timestamp
 * - QR Verifikasi
 */

var TemplateHelper = (function () {
  /**
   * Escape HTML untuk mencegah XSS/injection pada template
   * @param {*} value - Nilai yang akan di-escape
   * @returns {string}
   */
  function escapeHtml(value) {
    if (value === undefined || value === null) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Format tanggal untuk tampilan PDF
   * @param {string|Date} value - Tanggal
   * @returns {string}
   */
  function formatDate(value) {
    if (!value) return '-';
    var d = new Date(value);
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  /**
   * Format datetime untuk tampilan PDF
   * @param {string|Date} value - Datetime
   * @returns {string}
   */
  function formatDateTime(value) {
    if (!value) return '-';
    var d = new Date(value);
    return (
      d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }) +
      ' ' +
      d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    );
  }

  /**
   * Mendapatkan QR code sebagai base64 dari token ekspedisi
   * Menggunakan API publik (api.qrserver.com).
   * @param {string} verifyData - Data yang di-encode ke QR
   * @returns {string} Base64 PNG (tanpa prefix data URL) atau string kosong jika gagal
   */
  function getQrBase64(verifyData) {
    try {
      var qrUrl =
        'https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&data=' +
        encodeURIComponent(verifyData);
      var response = UrlFetchApp.fetch(qrUrl, { muteHttpExceptions: true });
      if (response.getResponseCode() !== 200) {
        Logger.warn('TemplateHelper', 'QR API tidak merespon', response.getResponseCode());
        return '';
      }
      var blob = response.getBlob();
      return Utilities.base64Encode(blob.getBytes());
    } catch (e) {
      Logger.warn('TemplateHelper', 'Gagal generate QR', e.message);
      return '';
    }
  }

  /**
   * Membangun template HTML bukti penerimaan
   * @param {object} data - { penerimaan, surat, ekspedisi, fotoBase64, signatureBase64, qrBase64, namaInstansi }
   * @returns {string} HTML string
   */
  function buildBuktiPenerimaanHtml(data) {
    var p = data.penerimaan || {};
    var s = data.surat || {};
    var e = data.ekspedisi || {};
    var fotoBase64 = data.fotoBase64 || '';
    var signatureBase64 = data.signatureBase64 || '';
    var qrBase64 = data.qrBase64 || '';
    var instansi = data.namaInstansi || 'Instansi Pemerintah';

    var fotoImg = fotoBase64
      ? '<img src="data:image/png;base64,' + fotoBase64 + '" class="media foto" alt="Foto Penerima" />'
      : '<p class="muted">Foto tidak tersedia</p>';
    var sigImg = signatureBase64
      ? '<img src="data:image/png;base64,' + signatureBase64 + '" class="media signature" alt="Tanda Tangan" />'
      : '<p class="muted">Tanda tangan tidak tersedia</p>';
    var qrImg = qrBase64
      ? '<img src="data:image/png;base64,' + qrBase64 + '" class="qr" alt="QR Verifikasi" />'
      : '';

    return (
      '<html><head><meta charset="utf-8"><style>' +
      'body { font-family: Arial, sans-serif; font-size: 13px; color: #1f2937; margin: 32px; }' +
      '.header { text-align: center; border-bottom: 3px solid #0f172a; padding-bottom: 12px; margin-bottom: 24px; }' +
      '.header h1 { margin: 0; font-size: 18px; }' +
      '.header p { margin: 4px 0 0; color: #6b7280; font-size: 12px; }' +
      'h2 { font-size: 14px; margin: 20px 0 8px; color: #0f172a; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }' +
      '.info-table { width: 100%; border-collapse: collapse; }' +
      '.info-table td { padding: 5px 0; vertical-align: top; }' +
      '.info-table td.label { width: 160px; color: #6b7280; }' +
      '.info-table td.value { font-weight: 600; }' +
      '.media { max-width: 140px; max-height: 140px; border: 1px solid #e5e7eb; margin: 4px 12px 12px 0; }' +
      '.media.foto { max-width: 120px; max-height: 140px; }' +
      '.media.signature { max-width: 180px; max-height: 90px; background: #fff; }' +
      '.qr-section { text-align: center; margin-top: 24px; }' +
      '.qr { width: 130px; height: 130px; }' +
      '.footer { margin-top: 32px; text-align: center; color: #9ca3af; font-size: 10px; }' +
      '</style></head><body>' +
      '<div class="header">' +
      '<h1>BUKTI PENERIMAAN DOKUMEN</h1>' +
      '<p>' + escapeHtml(instansi) + '</p>' +
      '</div>' +

      '<h2>Informasi Surat</h2>' +
      '<table class="info-table">' +
      '<tr><td class="label">Nomor Ekspedisi</td><td class="value">' + escapeHtml(e.nomor_ekspedisi) + '</td></tr>' +
      '<tr><td class="label">Nomor Surat</td><td class="value">' + escapeHtml(s.nomor_surat) + '</td></tr>' +
      '<tr><td class="label">Tanggal Surat</td><td class="value">' + escapeHtml(formatDate(s.tanggal_surat)) + '</td></tr>' +
      '<tr><td class="label">Perihal</td><td class="value">' + escapeHtml(s.perihal) + '</td></tr>' +
      '</table>' +

      '<h2>Informasi Penerima</h2>' +
      '<table class="info-table">' +
      '<tr><td class="label">Nama</td><td class="value">' + escapeHtml(p.nama_penerima) + '</td></tr>' +
      '<tr><td class="label">Jabatan</td><td class="value">' + escapeHtml(p.jabatan) + '</td></tr>' +
      '<tr><td class="label">Instansi</td><td class="value">' + escapeHtml(p.instansi) + '</td></tr>' +
      '<tr><td class="label">Diterima Pada</td><td class="value">' + escapeHtml(formatDateTime(p.diterima_pada)) + '</td></tr>' +
      '</table>' +

      '<h2>Dokumentasi</h2>' +
      '<table class="info-table"><tr>' +
      '<td><p style="margin:0;color:#6b7280;">Foto Penerima</p>' + fotoImg + '</td>' +
      '<td><p style="margin:0;color:#6b7280;">Tanda Tangan</p>' + sigImg + '</td>' +
      '</tr></table>' +

      '<div class="qr-section">' +
      qrImg +
      '<p style="font-size:11px;color:#6b7280;">Pindai untuk verifikasi</p>' +
      '</div>' +

      '<div class="footer">Dokumen ini dihasilkan secara elektronik oleh sistem e-Ekspedisi</div>' +
      '</body></html>'
    );
  }

  return {
    escapeHtml: escapeHtml,
    formatDate: formatDate,
    formatDateTime: formatDateTime,
    getQrBase64: getQrBase64,
    buildBuktiPenerimaanHtml: buildBuktiPenerimaanHtml,
  };
})();
