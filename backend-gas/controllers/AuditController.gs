/**
 * AuditController.gs
 *
 * Controller untuk endpoint audit trail.
 *
 * Endpoint (Docs/06-API-Specification.md §8):
 * - GET /api/v1/audit?user=&aksi=&objek=&limit=50 (admin+)
 */

var AuditController = (function () {
  /**
   * GET /api/v1/audit
   */
  function list(parsed) {
    var auth = AuthMiddleware.requireAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }

    var filter = {
      user: parsed.query.user || '',
      aksi: parsed.query.aksi || '',
      objek: parsed.query.objek || '',
    };
    var limit = parseInt(parsed.query.limit, 10) || 50;

    var logs = AuditService.getAll(filter);
    if (limit > 0) {
      logs = logs.slice(0, limit);
    }

    return BaseController.sendSuccess({ items: logs, total: logs.length }, 'Daftar audit log');
  }

  /**
   * Registrasi route audit
   */
  function registerRoutes() {
    Router.add('GET', '/api/v1/audit', list);
  }

  return {
    list: list,
    registerRoutes: registerRoutes,
  };
})();
