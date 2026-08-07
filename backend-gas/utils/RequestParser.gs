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
    var method = (request.method || 'GET').toUpperCase();
    var path = request.pathInfo || '';
    var params = request.parameter || {};
    var headers = request.headers || {};
    var body = null;

    if (request.postData && request.postData.contents) {
      var contentType = (request.postData.type || '').toLowerCase();
      if (contentType.indexOf('application/json') !== -1) {
        try {
          body = JSON.parse(request.postData.contents);
        } catch (e) {
          body = request.postData.contents;
        }
      } else {
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
