/**
 * PegawaiController.gs
 *
 * Controller untuk endpoint master data pegawai.
 *
 * Endpoint:
 * - GET    /api/v1/master/pegawai       - Daftar pegawai (admin+)
 * - GET    /api/v1/master/pegawai/{id}  - Detail pegawai (admin+)
 * - POST   /api/v1/master/pegawai       - Tambah pegawai (super_admin)
 * - PUT    /api/v1/master/pegawai/{id}  - Edit pegawai (super_admin)
 * - DELETE /api/v1/master/pegawai/{id}  - Hapus pegawai (super_admin)
 */

var PegawaiController = (function () {
  /**
   * GET /api/v1/master/pegawai
   */
  function list(parsed) {
    var auth = AuthMiddleware.requireAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    var pegawai = PegawaiService.getAll();
    return BaseController.sendSuccess({ items: pegawai, total: pegawai.length }, 'Daftar pegawai');
  }

  /**
   * GET /api/v1/master/pegawai/{id}
   */
  function detail(parsed) {
    var auth = AuthMiddleware.requireAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    try {
      var pegawai = PegawaiService.getById(parsed.params.id);
      return BaseController.sendSuccess(pegawai, 'Detail pegawai');
    } catch (e) {
      return BaseController.sendError(ErrorHandler.handleError(e));
    }
  }

  /**
   * POST /api/v1/master/pegawai
   */
  function create(parsed) {
    var auth = AuthMiddleware.requireSuperAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    try {
      var pegawai = PegawaiService.create(parsed.body || {});
      AuditService.log(auth.user.username, 'CREATE_PEGAWAI', 'pegawai', 'Success');
      return BaseController.sendJson(
        ResponseHelper.success(pegawai, 'Pegawai berhasil dibuat')
      );
    } catch (e) {
      return BaseController.sendError(ErrorHandler.handleError(e));
    }
  }

  /**
   * PUT /api/v1/master/pegawai/{id}
   */
  function update(parsed) {
    var auth = AuthMiddleware.requireSuperAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    try {
      var pegawai = PegawaiService.update(parsed.params.id, parsed.body || {});
      AuditService.log(auth.user.username, 'UPDATE_PEGAWAI', 'pegawai', 'Success');
      return BaseController.sendSuccess(pegawai, 'Pegawai berhasil diperbarui');
    } catch (e) {
      return BaseController.sendError(ErrorHandler.handleError(e));
    }
  }

  /**
   * DELETE /api/v1/master/pegawai/{id}
   */
  function remove(parsed) {
    var auth = AuthMiddleware.requireSuperAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    try {
      PegawaiService.remove(parsed.params.id);
      AuditService.log(auth.user.username, 'DELETE_PEGAWAI', 'pegawai', 'Success');
      return BaseController.sendSuccess({ deleted: true }, 'Pegawai berhasil dihapus');
    } catch (e) {
      return BaseController.sendError(ErrorHandler.handleError(e));
    }
  }

  /**
   * Registrasi route master pegawai
   */
  function registerRoutes() {
    Router.add('GET', '/api/v1/master/pegawai', list);
    Router.add('GET', '/api/v1/master/pegawai/:id', detail);
    Router.add('POST', '/api/v1/master/pegawai', create);
    Router.add('PUT', '/api/v1/master/pegawai/:id', update);
    Router.add('DELETE', '/api/v1/master/pegawai/:id', remove);
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
