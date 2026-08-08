/**
 * SecurityMiddleware.gs
 *
 * Middleware keamanan untuk backend GAS.
 * - Sanitasi pola berbahaya pada request body (anti-XSS / injection)
 * - Validasi ukuran request
 *
 * Catatan desain:
 * - Frontend Vue meng-escape HTML otomatis saat render ({{ }}), jadi
 *   kita tidak perlu full HTML-escape yang bisa menyebabkan double-encoding.
 * - Yang kita lakukan: menghapus pola berbahaya (tag script, event handler,
 *   javascript: URI) sebagai defense-in-depth.
 * - Untuk rendering PDF, TemplateHelper.escapeHtml menangani escaping.
 *
 * Mengacu pada Docs/08-Security-Compliance.md:
 * - Validasi input (checklist keamanan)
 * - Perlindungan dari injeksi
 */

var SecurityMiddleware = (function () {
  var MAX_REQUEST_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB (limit GAS)

  // Pola berbahaya yang distrip (case insensitive)
  var DANGEROUS_PATTERNS = [
    /<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, // <script>...</script>
    /<\s*script[^>]*>/gi, // <script ...> tanpa penutup
    /\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, // event handler onclick= dsb
    /javascript\s*:/gi, // javascript: URI
    /<\s*iframe[^>]*>[\s\S]*?<\s*\/\s*iframe\s*>/gi, // <iframe>
  ];

  /**
   * Sanitize string dengan menghapus pola berbahaya
   * @param {string} str - String yang akan dibersihkan
   * @returns {string} String yang aman
   */
  function sanitizeString(str) {
    var result = String(str);
    for (var i = 0; i < DANGEROUS_PATTERNS.length; i++) {
      result = result.replace(DANGEROUS_PATTERNS[i], '');
    }
    return result;
  }

  /**
   * Sanitize seluruh string values di object/array (rekursif)
   * @param {*} obj - Object/array/string yang akan dibersihkan
   * @returns {*} Object yang sudah aman
   */
  function sanitizeBody(obj) {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(function (item) {
        return sanitizeBody(item);
      });
    }
    if (typeof obj === 'object') {
      var result = {};
      for (var key in obj) {
        result[key] = sanitizeBody(obj[key]);
      }
      return result;
    }
    return obj;
  }

  /**
   * Validasi ukuran request body (anti resource exhaustion)
   * @param {object} body - Request body
   * @returns {boolean} true jika ukuran OK
   */
  function isRequestSizeValid(body) {
    if (body === null || body === undefined) return true;
    try {
      var size = JSON.stringify(body).length;
      return size <= MAX_REQUEST_SIZE_BYTES;
    } catch (e) {
      return false;
    }
  }

  return {
    sanitizeString: sanitizeString,
    sanitizeBody: sanitizeBody,
    isRequestSizeValid: isRequestSizeValid,
    MAX_REQUEST_SIZE_BYTES: MAX_REQUEST_SIZE_BYTES,
  };
})();
