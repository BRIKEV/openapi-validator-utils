const commonArgsValidation = require('./argsValidation');
const { responseBuilder } = require('../utils');

/** @module Validators/optionsValidation */

/**
 * This method validates some params in the response method
 * @param {(numeric|boolean|string)} value value that user sends
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {number} status OpenApi status we want to validate
 */
const argsValidation = (value, endpoint, method, status) => {
  const commonValidation = commonArgsValidation(value, endpoint, method);
  if (!commonValidation.valid) {
    return commonValidation;
  }
  if (!status) {
    return responseBuilder(false, `Status: "${status}" is not valid`);
  }
  return responseBuilder(true);
};

module.exports = argsValidation;
