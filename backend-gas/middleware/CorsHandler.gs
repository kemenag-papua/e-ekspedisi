/**
 * CorsHandler.gs
 *
 * CATATAN (per analisis & testing):
 * ContentService GAS TIDAK mendukung custom HTTP headers, jadi kode
 * berikut TIDAK pernah benar-benar menambahkan header CORS ke response.
 * Google menangani CORS preflight/response secara infrastruktur untuk
 * web app dengan access ANYONE.
 *
 * Fungsi ini dipertahankan minimal hanya untuk kompatibilitas panggilan
 * (isPreflight) dari Code.gs; tidak ada logika header yang menyesatkan.
 */

var CorsHandler = (function () {
  /**
   * Cek apakah request adalah preflight (OPTIONS)
   * @param {object} request - Event request
   * @returns {boolean}
   */
  function isPreflight(request) {
    return request.method === 'OPTIONS';
  }

  /**
   * Catatan: GAS tidak mendukung custom CORS headers pada ContentService.
   * Response JSON dari web app ANYONE otomatis diberi
   * Access-Control-Allow-Origin oleh infrastruktur Google.
   * @param {object} request - Event request
   * @returns {object} Response OPTIONS kosong
   */
  function handlePreflight(request) {
    return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT);
  }

  return {
    isPreflight: isPreflight,
    handlePreflight: handlePreflight,
  };
})();
