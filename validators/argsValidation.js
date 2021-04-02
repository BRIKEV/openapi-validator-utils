const { responseBuilder } = require('../utils');

/** @module Validators/argsValidation */

/**
 * This method validates some params
 * @param {(numeric|boolean|string)} value value that user sends
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {string} key OpenApi key we want to validate in case we want to
 * validate headers, params or query params
 */
const argsValidation = (value, endpoint, method, key) => {
  if (value === undefined) {
    return responseBuilder(false, `Value: "${value}" is required`);
  }
  if (!endpoint) {
    return responseBuilder(false, `Endpoint: "${endpoint}" is required`);
  }
  if (!method) {
    return responseBuilder(false, `Method: "${method}" is not valid`);
  }
  if (key !== undefined && !key) {
    return responseBuilder(false, `Key: "${key}" is not valid`);
  }
  return responseBuilder(true);
};

module.exports = argsValidation;
