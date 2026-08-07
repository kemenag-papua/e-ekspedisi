/**
 * BaseController.gs
 *
 * Controller base untuk HTTP handler.
 * Semua controller harus mewarisi kelas ini.
 *
 * Aturan (Docs/09-Development-Guide.md):
 * - Controller hanya menerima request dan mengembalikan response.
 * - Controller tidak boleh mengakses Spreadsheet langsung.
 * - Controller tipis (thin controller).
 */

var BaseController = (function () {
  function BaseController() {}

  /**
   * Validasi body request
   * @param {object} body - Request body
   * @param {Array} requiredFields - Field wajib
   * @returns {Array} Daftar error (kosong jika valid)
   */
  function validateRequired(body, requiredFields) {
    var errors = [];
    for (var i = 0; i < requiredFields.length; i++) {
      var field = requiredFields[i];
      var value = body ? body[field] : undefined;
      if (value === undefined || value === null || String(value).trim() === '') {
        errors.push({ field: field, message: field + ' wajib diisi' });
      }
    }
    return errors;
  }

  /**
   * Send JSON response
   * @param {object} data - Standard response object
   * @returns {object} ContentService response
   */
  function sendJson(data) {
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
      ContentService.MimeType.JSON
    );
  }

  /**
   * Send success response
   * @param {object} data - Data
   * @param {string} message - Pesan
   * @returns {object}
   */
  function sendSuccess(data, message) {
    return sendJson(ResponseHelper.success(data, message));
  }

  /**
   * Send error response
   * @param {object} response - Standard error response
   * @returns {object}
   */
  function sendError(response) {
    return sendJson(response);
  }

  /**
   * Validasi dan kirim error jika ada
   * @param {object} body - Request body
   * @param {Array} requiredFields - Field wajib
   * @returns {object|null} Response error atau null jika valid
   */
  function validateOrError(body, requiredFields) {
    var errors = validateRequired(body, requiredFields);
    if (errors.length > 0) {
      return sendError(ResponseHelper.validationError(errors));
    }
    return null;
  }

  return {
    validateRequired: validateRequired,
    validateOrError: validateOrError,
    sendJson: sendJson,
    sendSuccess: sendSuccess,
    sendError: sendError,
  };
})();
