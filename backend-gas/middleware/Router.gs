/**
 * Router.gs
 *
 * Simple router untuk Google Apps Script Web App.
 * Menyediakan routing berbasis method + path.
 *
 * Struktur route:
 * {
 *   method: 'GET',
 *   path: '/surat',
 *   handler: function(request) { ... }
 * }
 */

var Router = (function () {
  var routes = [];

  /**
   * Menambahkan route
   * @param {string} method - HTTP method
   * @param {string} path - Path pattern ('/surat', '/surat/:id')
   * @param {function} handler - Handler function
   */
  function add(method, path, handler) {
    routes.push({
      method: method.toUpperCase(),
      path: path,
      handler: handler,
    });
  }

  /**
   * Mencocokkan path dengan pattern route
   * @param {string} pattern - Pattern route
   * @param {string} path - Path aktual
   * @returns {object|null} { params } atau null
   */
  function match(pattern, path) {
    var patternParts = pattern.split('/').filter(function (p) {
      return p !== '';
    });
    var pathParts = (path || '').split('/').filter(function (p) {
      return p !== '';
    });

    if (patternParts.length !== pathParts.length) return null;

    var params = {};
    for (var i = 0; i < patternParts.length; i++) {
      var pp = patternParts[i];
      var p = pathParts[i];
      if (pp.charAt(0) === ':') {
        params[pp.substring(1)] = decodeURIComponent(p);
      } else if (pp !== p) {
        return null;
      }
    }
    return params;
  }

  /**
   * Mencari route yang cocok
   * @param {object} parsed - Parsed request { method, path }
   * @returns {object|null} { route, params }
   */
  function find(parsed) {
    for (var i = 0; i < routes.length; i++) {
      var route = routes[i];
      if (route.method !== parsed.method) continue;
      var result = match(route.path, parsed.path);
      if (result) {
        return { route: route, params: result };
      }
    }
    return null;
  }

  /**
   * Menjalankan route yang cocok
   * @param {object} parsed - Parsed request
   * @returns {object|null} Hasil handler atau null
   */
  function dispatch(parsed) {
    var matchResult = find(parsed);
    if (!matchResult) return null;
    parsed.params = matchResult.params;
    return matchResult.route.handler(parsed);
  }

  /**
   * Mendapatkan daftar route terdaftar
   * @returns {Array} Routes
   */
  function getRoutes() {
    return routes.slice();
  }

  return {
    add: add,
    find: find,
    dispatch: dispatch,
    getRoutes: getRoutes,
  };
})();
