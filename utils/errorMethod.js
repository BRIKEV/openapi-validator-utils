const util = require('util');

function InputValidationError(message, type, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'OpenAPIUtilsError';
  this.type = type;
  this.message = message;
  this.extra = extra;
}
util.inherits(InputValidationError, Error);

const errorMethod = (type, handler) => (message, extra) => {
  if (handler) {
    return handler(message, extra);
  }
  const error = new InputValidationError(message, type, extra);
  throw error;
};

const basicError = errorMethod('basic');

module.exports = { basicError };
