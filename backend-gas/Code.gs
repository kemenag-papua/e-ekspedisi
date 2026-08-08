/**
 * Code.gs
 *
 * Entry point utama Google Apps Script Web App.
 * Menangani doGet dan doPost, routing, CORS, dan error handling.
 *
 * Endpoint structure mengikuti Docs/06-API-Specification.md:
 * Semua endpoint berada pada /api/v1
 */

/**
 * Global router instance
 * @type {object}
 */
var AppRouter = Router;

/**
 * Menangani GET request
 * @param {object} e - Event object dari Apps Script
 * @returns {object} Response
 */
function doGet(e) {
  if (CorsHandler.isPreflight(e)) {
    return CorsHandler.handlePreflight(e);
  }
  return handleRequest(e);
}

/**
 * Menangani POST request
 * @param {object} e - Event object dari Apps Script
 * @returns {object} Response
 */
function doPost(e) {
  if (CorsHandler.isPreflight(e)) {
    return CorsHandler.handlePreflight(e);
  }
  return handleRequest(e);
}

/**
 * Handler utama untuk semua request
 * @param {object} e - Event request
 * @returns {object} Response
 */
function handleRequest(e) {
  return ErrorHandler.run(function () {
    var parsed = RequestParser.parse(e);
    Logger.info('Code', 'Incoming request', {
      method: parsed.method,
      path: parsed.path,
    });

    // TODO: Sprint 2 - integrasi AuthMiddleware
    // TODO: Sprint 3+ - registrasi route controller

    var result = AppRouter.dispatch(parsed);
    if (result === null) {
      return ContentService.createTextOutput(
        JSON.stringify(ResponseHelper.notFound('Endpoint'))
      ).setMimeType(ContentService.MimeType.JSON);
    }
    return result;
  });
}

/**
 * Endpoint untuk health check
 */
Router.add('GET', '/api/v1/health', function () {
  return BaseController.sendSuccess({ status: 'ok', timestamp: DateUtils.toIsoString(DateUtils.now()) }, 'OK');
});

/**
 * Registrasi route module
 */
function registerRoutes() {
  AuthController.registerRoutes();
  MasterUnitController.registerRoutes();
  PegawaiController.registerRoutes();
  SuratController.registerRoutes();
  EkspedisiController.registerRoutes();
  AuditController.registerRoutes();
  PenerimaanController.registerRoutes();
  VerifyController.registerRoutes();
  DashboardController.registerRoutes();
}

registerRoutes();
