const { isFunction } = require('lodash');
const util = require('util');

const ERROR_NAME = 'OpenAPIUtilsError';

function InputValidationError(message, type, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = ERROR_NAME;
  this.type = `${ERROR_NAME}:${type}`;
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
const path = errorMethod('path');
const query = errorMethod('query');
const headers = errorMethod('headers');
const response = errorMethod('response');

module.exports = {
  configuration,
  request,
  path,
  query,
  headers,
  response,
};
