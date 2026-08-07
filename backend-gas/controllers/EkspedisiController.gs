/**
 * EkspedisiController.gs
 *
 * Controller untuk endpoint ekspedisi.
 *
 * Endpoint (Docs/06-API-Specification.md):
 * - GET  /api/v1/ekspedisi/{id}      - Detail ekspedisi (admin+)
 * - POST /api/v1/ekspedisi/{id}/qr   - Regenerate QR (admin+)
 */

var EkspedisiController = (function () {
  /**
   * GET /api/v1/ekspedisi/{id}
   */
  function detail(parsed) {
    var auth = AuthMiddleware.requireAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    try {
      var ekspedisi = EkspedisiService.getById(parsed.params.id);
      return BaseController.sendSuccess(ekspedisi, 'Detail ekspedisi');
    } catch (e) {
      return BaseController.sendError(ErrorHandler.handleError(e));
    }
  }

  /**
   * POST /api/v1/ekspedisi/{id}/qr
   * Regenerate QR token
   */
  function regenerateQr(parsed) {
    var auth = AuthMiddleware.requireAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    try {
      var ekspedisi = EkspedisiService.getById(parsed.params.id);
      var newToken = EkspedisiService.generateQrToken();
      var updated = EkspedisiRepository.update(ekspedisi.id, { qr_token: newToken });
      var username = auth.user.username || 'system';
      AuditService.log(username, 'REGENERATE_QR', 'ekspedisi', 'Success');
      return BaseController.sendSuccess(updated, 'QR berhasil diperbarui');
    } catch (e) {
      return BaseController.sendError(ErrorHandler.handleError(e));
    }
  }

  /**
   * Registrasi route ekspedisi
   */
  function registerRoutes() {
    Router.add('GET', '/api/v1/ekspedisi/:id', detail);
    Router.add('POST', '/api/v1/ekspedisi/:id/qr', regenerateQr);
  }

  return {
    detail: detail,
    regenerateQr: regenerateQr,
    registerRoutes: registerRoutes,
  };
})();
