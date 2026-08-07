/**
 * PenerimaanController.gs
 *
 * Controller untuk endpoint konfirmasi penerimaan.
 *
 * Endpoint (Docs/06-API-Specification.md §6):
 * - POST /api/v1/penerimaan   - Konfirmasi penerimaan (admin+)
 * - GET  /api/v1/penerimaan/:id - Detail penerimaan (admin+)
 */

var PenerimaanController = (function () {
  /**
   * POST /api/v1/penerimaan
   */
  function create(parsed) {
    var auth = AuthMiddleware.requireAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    try {
      var penerimaan = PenerimaanService.create(parsed.body || {}, auth.user);
      return BaseController.sendJson(
        ResponseHelper.success(penerimaan, 'Penerimaan berhasil disimpan')
      );
    } catch (e) {
      return BaseController.sendError(ErrorHandler.handleError(e));
    }
  }

  /**
   * GET /api/v1/penerimaan/{id}
   */
  function detail(parsed) {
    var auth = AuthMiddleware.requireAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    try {
      var penerimaan = PenerimaanService.getById(parsed.params.id);
      return BaseController.sendSuccess(penerimaan, 'Detail penerimaan');
    } catch (e) {
      return BaseController.sendError(ErrorHandler.handleError(e));
    }
  }

  /**
   * Registrasi route penerimaan
   */
  function registerRoutes() {
    Router.add('POST', '/api/v1/penerimaan', create);
    Router.add('GET', '/api/v1/penerimaan/:id', detail);
  }

  return {
    create: create,
    detail: detail,
    registerRoutes: registerRoutes,
  };
})();
