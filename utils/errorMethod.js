const { isFunction } = require('lodash');
const util = require('util');

function InputValidationError(message, type, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'OpenAPIUtilsError';
  this.type = type;
  this.message = message;
  this.extra = extra;
}
util.inherits(InputValidationError, Error);

const errorMethod = type => (message, handler, extra) => {
  if (handler && isFunction(handler)) {
    throw handler(message, extra);
  }
  const error = new InputValidationError(message, type, extra);
  throw error;
};

const configuration = errorMethod('arguments');
const request = errorMethod('request');
const params = errorMethod('params');
const response = errorMethod('response');

module.exports = {
  configuration,
  request,
  params,
  response,
};
