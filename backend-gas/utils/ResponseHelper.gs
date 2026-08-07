/**
 * ResponseHelper.gs
 *
 * Helper untuk membuat standard response format sesuai Docs/06-API-Specification.md
 *
 * Response Berhasil:
 * {
 *   "success": true,
 *   "message": "OK",
 *   "data": {}
 * }
 *
 * Response Gagal:
 * {
 *   "success": false,
 *   "message": "Validation Error",
 *   "errors": []
 * }
 */

var ResponseHelper = (function () {
  /**
   * Membuat response sukses
   * @param {object} data - Data yang dikembalikan
   * @param {string} message - Pesan sukses
   * @param {number} status - HTTP status code
   * @returns {object} Standard response object
   */
  function success(data, message, status) {
    return {
      success: true,
      message: message || 'OK',
      data: data || {},
      status: status || 200,
    };
  }

  /**
   * Membuat response gagal
   * @param {string} message - Pesan error
   * @param {number} status - HTTP status code
   * @param {Array} errors - Detail error validasi
   * @returns {object} Standard response object
   */
  function error(message, status, errors) {
    return {
      success: false,
      message: message || 'Terjadi kesalahan',
      errors: errors || [],
      status: status || 500,
    };
  }

  /**
   * Membuat response 400 (Validation Error)
   * @param {Array} errors - Detail error
   * @returns {object}
   */
  function validationError(errors) {
    return error('Validation Error', 400, errors);
  }

  /**
   * Membuat response 401 (Unauthorized)
   * @returns {object}
   */
  function unauthorized() {
    return error('Belum login', 401, []);
  }

  /**
   * Membuat response 403 (Forbidden)
   * @returns {object}
   */
  function forbidden() {
    return error('Tidak berhak mengakses', 403, []);
  }

  /**
   * Membuat response 404 (Not Found)
   * @param {string} resource - Nama resource
   * @returns {object}
   */
  function notFound(resource) {
    return error((resource || 'Data') + ' tidak ditemukan', 404, []);
  }

  /**
   * Membuat response 409 (Conflict / Duplicate)
   * @param {string} message - Pesan duplikasi
   * @returns {object}
   */
  function conflict(message) {
    return error(message || 'Data duplikat', 409, []);
  }

  /**
   * Membuat response 500 (Internal Server Error)
   * @param {string} message - Pesan error
   * @returns {object}
   */
  function serverError(message) {
    return error(message || 'Kesalahan server', 500, []);
  }

  return {
    success: success,
    error: error,
    validationError: validationError,
    unauthorized: unauthorized,
    forbidden: forbidden,
    notFound: notFound,
    conflict: conflict,
    serverError: serverError,
  };
})();
