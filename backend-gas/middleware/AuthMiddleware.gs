/**
 * AuthMiddleware.gs
 *
 * Middleware autentikasi dan otorisasi (RBAC).
 * Dikembangkan lengkap pada Sprint 2 (Docs/12-Project-Roadmap-Sprint-Backlog.md).
 *
 * Saat ini menyediakan skeleton dengan fungsi yang akan diimplementasikan
 * pada sprint berikutnya.
 */

var AuthMiddleware = (function () {
  var ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    PENERIMA: 'penerima',
    PIMPINAN: 'pimpinan',
  };

  /**
   * Mendapatkan current user dari session/token
   * TODO: Implementasi pada Sprint 2
   * @param {object} request - Event request
   * @returns {object|null} User object atau null
   */
  function getCurrentUser(request) {
    var headers = request.headers || {};
    var authHeader = headers['Authorization'] || headers['authorization'] || '';
    if (!authHeader || authHeader.indexOf('Bearer ') !== 0) {
      return null;
    }
    var token = authHeader.substring(7);
    // TODO: Sprint 2 - validate token terhadap session
    return token ? { id: 'placeholder', role: ROLES.ADMIN } : null;
  }

  /**
   * Middleware autentikasi
   * @param {object} request - Event request
   * @param {Array} allowedRoles - Roles yang diizinkan (RBAC)
   * @returns {object|null} User atau error response
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
    getCurrentUser: getCurrentUser,
    authenticate: authenticate,
    requireSuperAdmin: requireSuperAdmin,
    requireAdmin: requireAdmin,
    requireAuth: requireAuth,
  };
})();
