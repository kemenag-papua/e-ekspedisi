/**
 * ReportsController.gs
 *
 * Controller untuk endpoint laporan.
 *
 * Endpoint:
 * - GET /api/v1/reports/surat?status=&unit=&dateFrom=&dateTo=&search=
 *   Akses: admin+, pimpinan
 */

var ReportsController = (function () {
  /**
   * Guard akses laporan (admin+, pimpinan)
   * @param {object} parsed - Parsed request
   * @returns {object} { user } atau { error }
   */
  function guard(parsed) {
    return AuthMiddleware.authenticate(parsed, [
      AuthMiddleware.ROLES.SUPER_ADMIN,
      AuthMiddleware.ROLES.ADMIN,
      AuthMiddleware.ROLES.PIMPINAN,
    ]);
  }

  /**
   * GET /api/v1/reports/surat
   */
  function suratReport(parsed) {
    var auth = guard(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }

    var filters = {
      status: parsed.query.status || '',
      unitId: parsed.query.unit || '',
      dateFrom: parsed.query.dateFrom || '',
      dateTo: parsed.query.dateTo || '',
      search: parsed.query.search || '',
    };

    var result = ReportsService.getSuratReport(filters);
    return BaseController.sendSuccess(result, 'Laporan surat keluar');
  }

  /**
   * Registrasi route laporan
   */
  function registerRoutes() {
    Router.add('GET', '/api/v1/reports/surat', suratReport);
  }

  return {
    suratReport: suratReport,
    registerRoutes: registerRoutes,
  };
})();
