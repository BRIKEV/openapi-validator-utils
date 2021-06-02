export = argsValidation;
/** @module Validators/optionsValidation */
/**
 * This method validates some params in the response method
 * @param {(numeric|boolean|string)} value value that user sends
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {number} status OpenApi status we want to validate
 * @returns {BuilderResponse}
 */
declare function argsValidation(value: (any | boolean | string), endpoint: string, method: string, status: number): any;
