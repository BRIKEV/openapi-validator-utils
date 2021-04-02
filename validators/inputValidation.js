const { isPlainObject, isEmpty } = require('lodash');
const { responseBuilder } = require('../utils');

/** @module Validators/inputValidation */

/**
 * This method validates we send a valid OpenAPI definition
 * @param {object} openAPIDef OpenApi definition
 * @returns {BuilderResponse}
 */
const inputValidation = openAPIDef => {
  if (!isPlainObject(openAPIDef)) {
    return responseBuilder(false, 'Input is not a valid JSON');
  }
  if (isEmpty(openAPIDef)) {
    return responseBuilder(false, 'Please provide a valid OpenAPI docs');
  }
  if (!openAPIDef.openapi) {
    return responseBuilder(false, 'OpenAPI definition must be 3.x version');
  }
  return responseBuilder(true);
};

module.exports = inputValidation;
