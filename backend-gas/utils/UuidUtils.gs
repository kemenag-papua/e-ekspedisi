/**
 * UuidUtils.gs
 *
 * Utility untuk generate UUID v4.
 * Google Apps Script tidak menyediakan crypto.randomUUID natively,
 * sehingga digunakan Utilities.getUuid() yang merupakan UUID v4.
 */

var UuidUtils = (function () {
  /**
   * Generate UUID v4
   * @returns {string} UUID
   */
  function generate() {
    return Utilities.getUuid();
  }

  /**
   * Validasi format UUID
   * @param {string} value - UUID yang divalidasi
   * @returns {boolean} true jika valid
   */
  function isValid(value) {
    if (!value || typeof value !== 'string') return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
  }

  return {
    generate: generate,
    isValid: isValid,
  };
})();
