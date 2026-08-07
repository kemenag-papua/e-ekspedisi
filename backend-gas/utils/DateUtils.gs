/**
 * DateUtils.gs
 *
 * Utility untuk format tanggal dan waktu.
 * Menggunakan timezone Asia/Jakarta (WIB).
 */

var DateUtils = (function () {
  var TIMEZONE = 'Asia/Jakarta';

  /**
   * Format tanggal ke YYYY-MM-DD
   * @param {Date|string} date - Tanggal
   * @returns {string} Tanggal terformat
   */
  function toDateString(date) {
    var d = date instanceof Date ? date : new Date(date);
    return Utilities.formatDate(d, TIMEZONE, 'yyyy-MM-dd');
  }

  /**
   * Format datetime ke YYYY-MM-DD HH:mm:ss
   * @param {Date|string} date - Datetime
   * @returns {string} Datetime terformat
   */
  function toDateTimeString(date) {
    var d = date instanceof Date ? date : new Date(date);
    return Utilities.formatDate(d, TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
  }

  /**
   * Format datetime ke ISO 8601
   * @param {Date|string} date - Datetime
   * @returns {string} ISO string
   */
  function toIsoString(date) {
    var d = date instanceof Date ? date : new Date(date);
    return d.toISOString();
  }

  /**
   * Mendapatkan waktu sekarang
   * @returns {Date}
   */
  function now() {
    return new Date();
  }

  return {
    toDateString: toDateString,
    toDateTimeString: toDateTimeString,
    toIsoString: toIsoString,
    now: now,
    TIMEZONE: TIMEZONE,
  };
})();
