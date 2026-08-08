/**
 * PdfService.gs
 *
 * Service untuk generate PDF bukti penerimaan.
 *
 * Alur:
 * 1. Bangun HTML (TemplateHelper.buildBuktiPenerimaanHtml)
 * 2. Upload HTML -> Google Doc (Drive API v2, convert=true)
 * 3. Export Google Doc -> PDF (Google Docs export feed)
 * 4. Simpan PDF ke Google Drive (folder Bukti-Penerimaan)
 * 5. Hapus Google Doc temporary
 *
 * Business Rules:
 * - BR-DOC-002: Sistem membuat PDF Bukti Penerimaan secara otomatis.
 * - BR-DOC-003: PDF Bukti Penerimaan bersifat arsip dan tidak boleh diubah.
 */

var PdfService = (function () {
  var DOC_MIME = 'application/vnd.google-apps.document';

  /**
   * Membuat Google Doc dari HTML menggunakan Drive API v2 REST
   * (tidak memerlukan Advanced Google Service).
   * @param {string} htmlContent - HTML yang akan dikonversi
   * @param {string} title - Judul dokumen
   * @returns {object} { id, name, alternateLink }
   */
  function htmlToGoogleDoc(htmlContent, title) {
    var boundary = 'e_ekspedisi_boundary_' + Utilities.getUuid().replace(/-/g, '');
    var metadata = JSON.stringify({
      title: title,
      mimeType: DOC_MIME,
    });

    var multipartBody =
      '--' + boundary + '\r\n' +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      metadata + '\r\n' +
      '--' + boundary + '\r\n' +
      'Content-Type: text/html; charset=UTF-8\r\n\r\n' +
      htmlContent + '\r\n' +
      '--' + boundary + '--';

    var url = 'https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart&convert=true';

    var response = UrlFetchApp.fetch(url, {
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
        'Content-Type': 'multipart/related; boundary=' + boundary,
      },
      payload: multipartBody,
      muteHttpExceptions: true,
    });

    if (response.getResponseCode() !== 200) {
      throw new Error('Gagal membuat Google Doc: ' + response.getContentText());
    }
    return JSON.parse(response.getContentText());
  }

  /**
   * Export Google Doc menjadi blob PDF
   * @param {string} docId - ID Google Doc
   * @param {string} pdfName - Nama file PDF
   * @returns {Blob} PDF blob
   */
  function exportDocAsPdf(docId, pdfName) {
    var exportUrl =
      'https://docs.google.com/feeds/download/documents/export/Export?id=' +
      docId +
      '&exportFormat=pdf';

    var response = UrlFetchApp.fetch(exportUrl, {
      headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
      muteHttpExceptions: true,
    });

    if (response.getResponseCode() !== 200) {
      throw new Error('Gagal export PDF: ' + response.getResponseCode());
    }
    return response.getBlob().setName(pdfName + '.pdf');
  }

  /**
   * Menghapus file Google Doc temporary
   * @param {string} docId - ID Google Doc
   */
  function trashTempDoc(docId) {
    try {
      DriveApp.getFileById(docId).setTrashed(true);
    } catch (e) {
      Logger.warn('PdfService', 'Gagal menghapus doc temporary', e.message);
    }
  }

  /**
   * Membaca file Drive sebagai base64
   * @param {string} fileId - ID file di Drive
   * @returns {string} Base64
   */
  function getFileBase64(fileId) {
    try {
      var blob = DriveApp.getFileById(fileId).getBlob();
      return Utilities.base64Encode(blob.getBytes());
    } catch (e) {
      Logger.warn('PdfService', 'Gagal baca file sebagai base64', fileId);
      return '';
    }
  }

  /**
   * Generate PDF bukti penerimaan dan simpan ke Drive
   * @param {object} penerimaan - Data penerimaan
   * @param {object} surat - Data surat keluar
   * @param {object} ekspedisi - Data ekspedisi
   * @returns {object} { id, name, url }
   */
  function generateBuktiPenerimaan(penerimaan, surat, ekspedisi) {
    // Data QR untuk verifikasi (mengikuti format URL di frontend)
    var config = DatabaseConfig.getAppConfig();
    var appUrl = config.app_url || '';
    var verifyUrl = appUrl
      ? appUrl.replace(/\/$/, '') + '/verify/' + ekspedisi.id + '?token=' + ekspedisi.qr_token
      : ekspedisi.id + ':' + ekspedisi.qr_token;

    // Ambil foto dan signature dari Drive sebagai base64
    var fotoBase64 = penerimaan.foto_url ? getFileBase64(penerimaan.foto_url) : '';
    var signatureBase64 = penerimaan.signature_url ? getFileBase64(penerimaan.signature_url) : '';
    var qrBase64 = TemplateHelper.getQrBase64(verifyUrl);

    var htmlContent = TemplateHelper.buildBuktiPenerimaanHtml({
      penerimaan: penerimaan,
      surat: surat,
      ekspedisi: ekspedisi,
      fotoBase64: fotoBase64,
      signatureBase64: signatureBase64,
      qrBase64: qrBase64,
      namaInstansi: config.nama_instansi || 'Instansi Pemerintah',
    });

    var fileName = 'Bukti-' + ekspedisi.nomor_ekspedisi;

    // Konversi HTML -> Google Doc -> PDF
    var doc = htmlToGoogleDoc(htmlContent, fileName);
    var pdfBlob = exportDocAsPdf(doc.id, fileName);

    // Simpan PDF ke Drive
    var folder = DriveRepository.getFolder(DriveRepository.FOLDERS.BUKTI_PENERIMAAN);
    var pdfFile = folder.createFile(pdfBlob);

    // Bersihkan Google Doc temporary
    trashTempDoc(doc.id);

    return {
      id: pdfFile.getId(),
      name: pdfFile.getName(),
      url: pdfFile.getUrl(),
    };
  }

  return {
    generateBuktiPenerimaan: generateBuktiPenerimaan,
    htmlToGoogleDoc: htmlToGoogleDoc,
    exportDocAsPdf: exportDocAsPdf,
    getFileBase64: getFileBase64,
  };
})();
