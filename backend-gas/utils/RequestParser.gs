/**
 * RequestParser.gs
 *
 * Utility untuk parsing request dari Google Apps Script Web App.
 * Mendukung method GET, POST, PUT, DELETE.
 */

var RequestParser = (function () {
  /**
   * Parse request dari e.request (event object)
   * @param {object} request - Event request dari doGet/doPost
   * @returns {object} { method, path, params, query, body, headers }
   */
  function parse(request) {
    // GAS hanya menyediakan doGet/doPost (tidak ada doPut/doDelete).
    // Method diambil dari: (1) query ?_method= override (untuk PUT/DELETE via POST),
    // (2) request.method yang di-set eksplisit di Code.gs doGet/doPost.
    var method = 'GET';
    if (request.parameter && request.parameter._method) {
      method = String(request.parameter._method);
    } else if (request.method) {
      method = String(request.method);
    }
    method = method.toUpperCase();
    // BUG GAS #160622846: e.pathInfo memicu sign-in wall untuk user anonim.
    // Solusi: baca route dari query param `path` (tidak memicu bug),
    // fallback ke pathInfo untuk kompatibilitas.
    var path = '';
    if (request.parameter && request.parameter.path) {
      try {
        path = decodeURIComponent(String(request.parameter.path));
      } catch (e) {
        path = String(request.parameter.path);
      }
    } else {
      path = request.pathInfo || '';
    }
    var params = request.parameter || {};
    var headers = request.headers || {};
    var body = null;

    if (request.postData && request.postData.contents) {
      // Frontend mengirim body sebagai text/plain (strategi CORS - hindari preflight).
      // Body selalu berbentuk JSON string, jadi coba parse JSON apa pun content-type-nya.
      var contentType = (request.postData.type || '').toLowerCase();
      try {
        body = JSON.parse(request.postData.contents);
      } catch (e) {
        // Jika bukan JSON valid, gunakan sebagai string mentah
        body = request.postData.contents;
      }
    }

    return {
      method: method,
      path: path,
      params: params,
      query: request.parameter || {},
      body: body,
      headers: headers,
    };
  }

  /**
   * Mengambil ID resource dari path
   * Contoh: /surat/ABC123 -> ABC123
   * @param {string} path - Path dari request
   * @param {string} prefix - Prefix resource, contoh 'surat'
   * @returns {string|null} Resource ID atau null
   */
  function getResourceId(path, prefix) {
    if (!path) return null;
    var regex = new RegExp('^/?' + prefix + '/([^/]+)');
    var match = path.match(regex);
    return match ? decodeURIComponent(match[1]) : null;
  }

  /**
   * Parse query string
   * @param {object} parameter - Request parameter
   * @param {object} defaults - Nilai default
   * @returns {object} Query dengan nilai default
   */
  function query(parameter, defaults) {
    var result = {};
    defaults = defaults || {};
    for (var key in defaults) {
      result[key] = defaults[key];
    }
    for (var p in parameter) {
      result[p] = parameter[p];
    }
    return result;
  }

  return {
    parse: parse,
    getResourceId: getResourceId,
    query: query,
  };
})();
