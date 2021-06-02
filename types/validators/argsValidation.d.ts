export = argsValidation;
/** @module Validators/argsValidation */
/**
 * This method validates some params
 * @param {(numeric|boolean|string)} value value that user sends
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {string} key OpenApi key we want to validate in case we want to
 * validate headers, params or query params
 * @returns {BuilderResponse}
 */
declare function argsValidation(value: (any | boolean | string), endpoint: string, method: string, key: string): any;
