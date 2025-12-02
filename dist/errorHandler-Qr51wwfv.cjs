"use strict";
const SingletonBase = require("./SingletonBase-BygEKI3I.cjs");
var ErrorSeverity = /* @__PURE__ */ ((ErrorSeverity2) => {
  ErrorSeverity2[ErrorSeverity2["SILENT"] = 0] = "SILENT";
  ErrorSeverity2[ErrorSeverity2["WARNING"] = 1] = "WARNING";
  ErrorSeverity2[ErrorSeverity2["ERROR"] = 2] = "ERROR";
  ErrorSeverity2[ErrorSeverity2["CRITICAL"] = 3] = "CRITICAL";
  return ErrorSeverity2;
})(ErrorSeverity || {});
function handleError(error, context, severity = 2) {
  const message = error instanceof Error ? error.message : String(error);
  const errorData = error instanceof Error ? error : { value: error };
  switch (severity) {
    case 0:
      break;
    case 1:
      SingletonBase.logger.warn(message, context, errorData);
      break;
    case 2:
      SingletonBase.logger.error(message, context, errorData);
      throw error;
    case 3:
      SingletonBase.logger.error(`CRITICAL: ${message}`, context, errorData);
      throw error;
  }
}
function handleErrorWithOptions(error, context, options = {}) {
  const {
    severity = 2,
    data,
    message: customMessage,
    includeStack = false
  } = options;
  const errorMessage = customMessage || (error instanceof Error ? error.message : String(error));
  const errorData = {
    ...data || {},
    originalError: error instanceof Error ? error : { value: error },
    ...includeStack && error instanceof Error ? { stack: error.stack } : {}
  };
  switch (severity) {
    case 0:
      break;
    case 1:
      SingletonBase.logger.warn(errorMessage, context, errorData);
      break;
    case 2:
      SingletonBase.logger.error(errorMessage, context, errorData);
      throw error;
    case 3:
      SingletonBase.logger.error(`CRITICAL: ${errorMessage}`, context, errorData);
      throw error;
  }
}
function safeExecute(fn, context, severity = 1) {
  try {
    return fn();
  } catch (error) {
    handleError(error, context, severity);
    return void 0;
  }
}
async function safeExecuteAsync(fn, context, severity = 1) {
  try {
    return await fn();
  } catch (error) {
    handleError(error, context, severity);
    return void 0;
  }
}
function createErrorHandler(context) {
  return (error, severity = 2) => {
    handleError(error, context, severity);
  };
}
function throwValidationError(message, context, data) {
  const error = new Error(message);
  error.name = "ValidationError";
  handleErrorWithOptions(error, context, {
    severity: 2,
    data
  });
  throw error;
}
function assert(condition, message, context) {
  if (!condition) {
    throwValidationError(message, context);
  }
}
exports.ErrorSeverity = ErrorSeverity;
exports.assert = assert;
exports.createErrorHandler = createErrorHandler;
exports.handleError = handleError;
exports.handleErrorWithOptions = handleErrorWithOptions;
exports.safeExecute = safeExecute;
exports.safeExecuteAsync = safeExecuteAsync;
exports.throwValidationError = throwValidationError;
//# sourceMappingURL=errorHandler-Qr51wwfv.cjs.map
