/**
 * DashboardController.gs
 *
 * Controller untuk endpoint dashboard.
 *
 * Endpoint (Docs/06-API-Specification.md §7):
 * - GET /api/v1/dashboard/summary - Ringkasan KPI (admin+, pimpinan)
 * - GET /api/v1/dashboard/chart   - Data grafik bulanan (admin+, pimpinan)
 * - GET /api/v1/dashboard/recent  - Surat terbaru + aktivitas terakhir
 */

var DashboardController = (function () {
  /**
   * Guard akses dashboard (admin+, pimpinan)
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
   * GET /api/v1/dashboard/summary
   */
  function summary(parsed) {
    var auth = guard(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    var data = DashboardService.getSummary();
    return BaseController.sendSuccess(data, 'Ringkasan dashboard');
  }

  /**
   * GET /api/v1/dashboard/chart
   */
  function chart(parsed) {
    var auth = guard(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    var data = DashboardService.getChart();
    return BaseController.sendSuccess(data, 'Data grafik dashboard');
  }

  /**
   * GET /api/v1/dashboard/recent
   */
  function recent(parsed) {
    var auth = guard(parsed);
    if (auth.error) {
      return BaseController.sendError(auth.error);
    }
    var limit = parseInt(parsed.query.limit, 10) || 5;
    var data = {
      suratTerbaru: DashboardService.getRecentSurat(limit),
      aktivitasTerakhir: DashboardService.getRecentActivity(limit),
    };
    return BaseController.sendSuccess(data, 'Data terbaru dashboard');
  }

  /**
   * Registrasi route dashboard
   */
  function registerRoutes() {
    Router.add('GET', '/api/v1/dashboard/summary', summary);
    Router.add('GET', '/api/v1/dashboard/chart', chart);
    Router.add('GET', '/api/v1/dashboard/recent', recent);
  }

  return {
    summary: summary,
    chart: chart,
    recent: recent,
    registerRoutes: registerRoutes,
  };
})();
