/**
 * AuthController.gs
 *
 * Controller untuk endpoint autentikasi.
 * Mengacu pada Docs/06A-API-Contract-OpenAPI.md:
 * - POST /api/v1/auth/login
 * - POST /api/v1/auth/logout
 * - GET  /api/v1/auth/me
 *
 * Aturan:
 * - Controller hanya menerima request dan mengembalikan response.
 * - Business logic ada di AuthService.
 */

var AuthController = (function () {
  /**
   * POST /api/v1/auth/login
   */
  function login(parsed) {
    var body = parsed.body || {};
    var errors = BaseController.validateRequired(body, ['username', 'password']);
    if (errors.length > 0) {
      return BaseController.sendError(ResponseHelper.validationError(errors));
    }

    var result = AuthService.login(body.username, body.password);
    return BaseController.sendSuccess(result, 'Login berhasil');
  }

  /**
   * POST /api/v1/auth/logout
   */
  function logout(parsed) {
    var headers = parsed.headers || {};
    var authHeader = headers['Authorization'] || headers['authorization'] || '';
    var token = authHeader.indexOf('Bearer ') === 0 ? authHeader.substring(7) : '';

    var result = AuthService.logout(token);
    return BaseController.sendSuccess({ loggedOut: result }, 'Logout berhasil');
  }

  /**
   * GET /api/v1/auth/me
   */
  function me(parsed) {
    var auth = AuthMiddleware.requireAuth(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    return BaseController.sendSuccess(auth.user, 'Profil pengguna');
  }

  /**
   * Registrasi route autentikasi
   */
  function registerRoutes() {
    Router.add('POST', '/api/v1/auth/login', login);
    Router.add('POST', '/api/v1/auth/logout', logout);
    Router.add('GET', '/api/v1/auth/me', me);
  }

  return {
    login: login,
    logout: logout,
    me: me,
    registerRoutes: registerRoutes,
  };
})();
