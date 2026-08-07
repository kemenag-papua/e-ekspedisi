/**
 * SuratController.gs
 *
 * Controller untuk endpoint surat keluar.
 *
 * Endpoint (Docs/06-API-Specification.md):
 * - GET    /api/v1/surat       - Daftar surat (admin+)
 * - GET    /api/v1/surat/{id}  - Detail surat (admin+)
 * - POST   /api/v1/surat       - Tambah surat + ekspedisi otomatis (admin+)
 * - PUT    /api/v1/surat/{id}  - Edit surat (admin+)
 * - DELETE /api/v1/surat/{id}  - Hapus surat (super_admin)
 */

var SuratController = (function () {
  /**
   * GET /api/v1/surat
   */
  function list(parsed) {
    var auth = AuthMiddleware.requireAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    var filters = {
      search: parsed.query.search || '',
      status: parsed.query.status || '',
    };
    var surats = SuratService.getAll(filters);
    return BaseController.sendSuccess({ items: surats, total: surats.length }, 'Daftar surat');
  }

  /**
   * GET /api/v1/surat/{id}
   */
  function detail(parsed) {
    var auth = AuthMiddleware.requireAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    try {
      var surat = SuratService.getById(parsed.params.id);
      return BaseController.sendSuccess(surat, 'Detail surat');
    } catch (e) {
      return BaseController.sendError(ErrorHandler.handleError(e));
    }
  }

  /**
   * GET /api/v1/surat/{id}/history
   * Riwayat aktivitas per surat
   */
  function history(parsed) {
    var auth = AuthMiddleware.requireAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    try {
      var surat = SuratService.getById(parsed.params.id);
      var history = AuditService.getAll({ objek_id: surat.id });
      return BaseController.sendSuccess(
        { items: history, total: history.length },
        'Riwayat surat'
      );
    } catch (e) {
      return BaseController.sendError(ErrorHandler.handleError(e));
    }
  }

  /**
   * POST /api/v1/surat
   */
  function create(parsed) {
    var auth = AuthMiddleware.requireAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    try {
      var result = SuratService.create(parsed.body || {}, auth.user);
      return BaseController.sendJson(
        ResponseHelper.success(result, 'Surat berhasil dibuat')
      );
    } catch (e) {
      return BaseController.sendError(ErrorHandler.handleError(e));
    }
  }

  /**
   * PUT /api/v1/surat/{id}
   */
  function update(parsed) {
    var auth = AuthMiddleware.requireAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    try {
      var surat = SuratService.update(parsed.params.id, parsed.body || {}, auth.user);
      return BaseController.sendSuccess(surat, 'Surat berhasil diperbarui');
    } catch (e) {
      return BaseController.sendError(ErrorHandler.handleError(e));
    }
  }

  /**
   * DELETE /api/v1/surat/{id}
   */
  function remove(parsed) {
    var auth = AuthMiddleware.requireSuperAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    try {
      SuratService.remove(parsed.params.id, auth.user);
      return BaseController.sendSuccess({ deleted: true }, 'Surat berhasil dihapus');
    } catch (e) {
      return BaseController.sendError(ErrorHandler.handleError(e));
    }
  }

  /**
   * Registrasi route surat keluar
   */
  function registerRoutes() {
    Router.add('GET', '/api/v1/surat', list);
    Router.add('GET', '/api/v1/surat/:id', detail);
    Router.add('GET', '/api/v1/surat/:id/history', history);
    Router.add('POST', '/api/v1/surat', create);
    Router.add('PUT', '/api/v1/surat/:id', update);
    Router.add('DELETE', '/api/v1/surat/:id', remove);
  }

  return {
    list: list,
    detail: detail,
    create: create,
    update: update,
    remove: remove,
    registerRoutes: registerRoutes,
  };
})();
