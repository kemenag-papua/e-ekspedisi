/**
 * ErrorHandler.gs
 *
 * Global error handling untuk Google Apps Script Web App.
 * Menyediakan error boundary yang konsisten sesuai Error Catalog
 * pada Docs/06-API-Specification.md dan Docs/09-Development-Guide.md.
 */

var ErrorHandler = (function () {
  /**
   * Wrapper untuk menjalankan handler dan menangkap error
   * @param {function} fn - Handler function
   * @returns {object} Result { success, message, errors, status, data }
   */
  function run(fn) {
    try {
      return fn();
    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Menangkap error dan mengubahnya menjadi response standar
   * @param {Error|object} e - Error yang terjadi
   * @returns {object} Standard error response
   */
  function handleError(e) {
    var status = e.status || e.statusCode || 500;
    var message = e.message || 'Kesalahan server';
    var errors = e.errors || [];
    var errorCode = e.errorCode || null;

    if (e instanceof ValidationError) {
      status = 400;
      message = e.message;
      errors = e.errors;
      errorCode = e.errorCode;
    } else if (e instanceof AuthError) {
      status = e.status;
      message = e.message;
    } else if (e instanceof NotFoundError) {
      status = 404;
      message = e.message;
      errorCode = e.errorCode;
    } else if (e instanceof ConflictError) {
      status = 409;
      message = e.message;
      errorCode = e.errorCode;
    }

    Logger.error('ErrorHandler', message, {
      status: status,
      errors: errors,
      errorCode: errorCode,
      stack: e.stack,
    });

    var response = {
      success: false,
      message: message,
      errors: errors,
      status: status,
    };
    if (errorCode) {
      response.errorCode = errorCode;
    }
    return response;
  }

  return {
    run: run,
    handleError: handleError,
  };
})();

/**
 * Custom Error Classes
 */

function ValidationError(message, errors, errorCode) {
  this.name = 'ValidationError';
  this.message = message || 'Validation Error';
  this.errors = errors || [];
  this.status = 400;
  this.errorCode = errorCode || null;
}

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;

function AuthError(message, status) {
  this.name = 'AuthError';
  this.message = message || 'Autentikasi gagal';
  this.status = status || 401;
}

AuthError.prototype = Object.create(Error.prototype);
AuthError.prototype.constructor = AuthError;

function NotFoundError(message, errorCode) {
  this.name = 'NotFoundError';
  this.message = message || 'Data tidak ditemukan';
  this.status = 404;
  this.errorCode = errorCode || null;
}

NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;

function ConflictError(message, errorCode) {
  this.name = 'ConflictError';
  this.message = message || 'Data duplikat';
  this.status = 409;
  this.errorCode = errorCode || null;
}

ConflictError.prototype = Object.create(Error.prototype);
ConflictError.prototype.constructor = ConflictError;
