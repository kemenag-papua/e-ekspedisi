/**
 * CorsHandler.gs
 *
 * Handler CORS untuk Google Apps Script Web App.
 * Menangani preflight request (OPTIONS) dan menambahkan header CORS.
 */

var CorsHandler = (function () {
  var ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://*.apps.googleusercontent.com',
  ];

  /**
   * Cek apakah request adalah preflight (OPTIONS)
   * @param {object} request - Event request
   * @returns {boolean}
   */
  function isPreflight(request) {
    return request.method === 'OPTIONS';
  }

  /**
   * Mendapatkan origin yang diizinkan
   * @param {object} request - Event request
   * @returns {string} Origin atau null
   */
  function getOrigin(request) {
    var headers = request.headers || {};
    var origin = headers['Origin'] || headers['origin'] || '';
    if (origin && origin.indexOf('localhost') !== -1) {
      return origin;
    }
    return ALLOWED_ORIGINS.indexOf(origin) !== -1 ? origin : null;
  }

  /**
   * Membuat response untuk preflight request
   * @param {object} request - Event request
   * @returns {object} Response OPTIONS
   */
  function handlePreflight(request) {
    var origin = getOrigin(request);
    var response = ContentService.createTextOutput();
    if (origin) {
      response.setMimeType(ContentService.MimeType.TEXT);
      response.setContent('');
      var headers = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Max-Age': '3600',
      };
      return response;
    }
    response.setMimeType(ContentService.MimeType.TEXT);
    response.setContent('Forbidden');
    return response;
  }

  /**
   * Menambahkan header CORS ke response.
   * Catatan: GAS ContentService tidak mendukung custom headers.
   * Untuk Web App deployment, Google menangani CORS pada response aktual.
   * Fungsi ini memastikan MIME type JSON.
   * @param {object} response - Response dari ContentService
   * @param {object} request - Event request
   * @returns {object} Response dengan MIME JSON
   */
  function addCorsHeaders(response, request) {
    var origin = getOrigin(request);
    if (origin) {
      response.setMimeType(ContentService.MimeType.JSON);
    }
    return response;
  }

  return {
    isPreflight: isPreflight,
    handlePreflight: handlePreflight,
    addCorsHeaders: addCorsHeaders,
    getOrigin: getOrigin,
  };
})();
