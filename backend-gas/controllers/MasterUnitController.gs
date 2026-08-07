/**
 * MasterUnitController.gs
 *
 * Controller untuk endpoint master data unit kerja.
 *
 * Endpoint:
 * - GET    /api/v1/master/unit       - Daftar unit (admin+)
 * - GET    /api/v1/master/unit/{id}  - Detail unit (admin+)
 * - POST   /api/v1/master/unit       - Tambah unit (super_admin)
 * - PUT    /api/v1/master/unit/{id}  - Edit unit (super_admin)
 * - DELETE /api/v1/master/unit/{id}  - Hapus unit (super_admin)
 */

var MasterUnitController = (function () {
  /**
   * GET /api/v1/master/unit
   */
  function list(parsed) {
    var auth = AuthMiddleware.requireAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    var units = MasterUnitService.getAll();
    return BaseController.sendSuccess({ items: units, total: units.length }, 'Daftar unit');
  }

  /**
   * GET /api/v1/master/unit/{id}
   */
  function detail(parsed) {
    var auth = AuthMiddleware.requireAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    try {
      var unit = MasterUnitService.getById(parsed.params.id);
      return BaseController.sendSuccess(unit, 'Detail unit');
    } catch (e) {
      return BaseController.sendError(ErrorHandler.handleError(e));
    }
  }

  /**
   * POST /api/v1/master/unit
   */
  function create(parsed) {
    var auth = AuthMiddleware.requireSuperAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    try {
      var unit = MasterUnitService.create(parsed.body || {});
      AuditService.log(auth.user.username, 'CREATE_UNIT', 'master_unit', 'Success');
      return BaseController.sendJson(
        ResponseHelper.success(unit, 'Unit berhasil dibuat')
      );
    } catch (e) {
      return BaseController.sendError(ErrorHandler.handleError(e));
    }
  }

  /**
   * PUT /api/v1/master/unit/{id}
   */
  function update(parsed) {
    var auth = AuthMiddleware.requireSuperAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    try {
      var unit = MasterUnitService.update(parsed.params.id, parsed.body || {});
      AuditService.log(auth.user.username, 'UPDATE_UNIT', 'master_unit', 'Success');
      return BaseController.sendSuccess(unit, 'Unit berhasil diperbarui');
    } catch (e) {
      return BaseController.sendError(ErrorHandler.handleError(e));
    }
  }

  /**
   * DELETE /api/v1/master/unit/{id}
   */
  function remove(parsed) {
    var auth = AuthMiddleware.requireSuperAdmin(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    try {
      MasterUnitService.remove(parsed.params.id);
      AuditService.log(auth.user.username, 'DELETE_UNIT', 'master_unit', 'Success');
      return BaseController.sendSuccess({ deleted: true }, 'Unit berhasil dihapus');
    } catch (e) {
      return BaseController.sendError(ErrorHandler.handleError(e));
    }
  }

  /**
   * Registrasi route master unit
   */
  function registerRoutes() {
    Router.add('GET', '/api/v1/master/unit', list);
    Router.add('GET', '/api/v1/master/unit/:id', detail);
    Router.add('POST', '/api/v1/master/unit', create);
    Router.add('PUT', '/api/v1/master/unit/:id', update);
    Router.add('DELETE', '/api/v1/master/unit/:id', remove);
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
