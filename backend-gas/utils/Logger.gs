/**
 * Logger.gs
 *
 * Utility logging untuk aplikasi.
 * Menggunakan console (Stackdriver Logging) untuk produksi.
 * Memberikan format log yang konsisten.
 */

var Logger = (function () {
  function format(level, scope, message, data) {
    var base = {
      level: level,
      scope: scope,
      message: message,
      timestamp: new Date().toISOString(),
    };
    if (data !== undefined && data !== null) {
      base.data = data;
    }
    return JSON.stringify(base);
  }

  /**
   * Log level info
   */
  function info(scope, message, data) {
    console.log(format('INFO', scope, message, data));
  }

  /**
   * Log level warn
   */
  function warn(scope, message, data) {
    console.warn(format('WARN', scope, message, data));
  }

  /**
   * Log level error
   */
  function error(scope, message, data) {
    console.error(format('ERROR', scope, message, data));
  }

  return {
    info: info,
    warn: warn,
    error: error,
  };
})();
