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

    // Hardening (Sprint 9):
    // 1. Rate limit per token (kecuali endpoint publik dengan batas sendiri)
    var token = AuthMiddleware.getToken(e) || '';
    var isPublic = parsed.path.indexOf('/api/v1/verify/') === 0 || parsed.path === '/api/v1/health';
    if (!isPublic && !RateLimitService.isAllowed(token)) {
      return ContentService.createTextOutput(
        JSON.stringify(
          ResponseHelper.error(
            'Terlalu banyak permintaan. Coba lagi dalam ' + RateLimitService.windowResetInSeconds() + ' detik.',
            429,
            []
          )
        )
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Validasi ukuran request body
    if (parsed.body && !SecurityMiddleware.isRequestSizeValid(parsed.body)) {
      return ContentService.createTextOutput(
        JSON.stringify(ResponseHelper.error('Ukuran request melebihi batas', 413, []))
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Sanitasi body (strip pola berbahaya - anti XSS/injection)
    if (parsed.body) {
      parsed.body = SecurityMiddleware.sanitizeBody(parsed.body);
    }

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
  ReportsController.registerRoutes();
}

registerRoutes();
