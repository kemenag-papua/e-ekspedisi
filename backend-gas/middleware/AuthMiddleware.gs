/**
 * AuthMiddleware.gs
 *
 * Middleware autentikasi dan otorisasi (RBAC).
 * Mengacu pada Docs/08-Security-Compliance.md:
 * - BR-SEC-001: Hak akses menggunakan RBAC.
 * - BR-SEC-002: Setiap endpoint harus memverifikasi autentikasi.
 * - BR-USR-001: 4 peran (Super Admin, Admin, Penerima, Pimpinan).
 */

var AuthMiddleware = (function () {
  var ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    PENERIMA: 'penerima',
    PIMPINAN: 'pimpinan',
  };

  /**
   * Mendapatkan token dari header Authorization
   * @param {object} request - Event request
   * @returns {string} Token atau string kosong
   */
  function getToken(request) {
    var headers = request.headers || {};
    var authHeader = headers['Authorization'] || headers['authorization'] || '';
    if (!authHeader || authHeader.indexOf('Bearer ') !== 0) {
      return '';
    }
    return authHeader.substring(7);
  }

  /**
   * Mendapatkan current user dari token (validasi ke session)
   * @param {object} request - Event request
   * @returns {object|null} User object atau null
   */
  function getCurrentUser(request) {
    var token = getToken(request);
    if (!token) return null;
    try {
      return AuthService.getUserFromToken(token);
    } catch (e) {
      Logger.warn('AuthMiddleware', 'Gagal validasi token', e.message);
      return null;
    }
  }

  /**
   * Middleware autentikasi
   * @param {object} request - Event request
   * @param {Array} allowedRoles - Roles yang diizinkan (RBAC)
   * @returns {object} { user } atau { error }
   */
  function authenticate(request, allowedRoles) {
    var user = getCurrentUser(request);
    if (!user) {
      return { error: ResponseHelper.unauthorized() };
    }
    if (allowedRoles && allowedRoles.length > 0 && allowedRoles.indexOf(user.role) === -1) {
      return { error: ResponseHelper.forbidden() };
    }
    return { user: user };
  }

  /**
   * Guard untuk role Super Admin
   * @param {object} request
   * @returns {object} { user } atau { error }
   */
  function requireSuperAdmin(request) {
    return authenticate(request, [ROLES.SUPER_ADMIN]);
  }

  /**
   * Guard untuk role Admin atau Super Admin
   * @param {object} request
   * @returns {object} { user } atau { error }
   */
  function requireAdmin(request) {
    return authenticate(request, [ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  }

  /**
   * Guard untuk siapa saja yang sudah login
   * @param {object} request
   * @returns {object} { user } atau { error }
   */
  function requireAuth(request) {
    return authenticate(request, null);
  }

  return {
    ROLES: ROLES,
    getToken: getToken,
    getCurrentUser: getCurrentUser,
    authenticate: authenticate,
    requireSuperAdmin: requireSuperAdmin,
    requireAdmin: requireAdmin,
    requireAuth: requireAuth,
  };
})();
