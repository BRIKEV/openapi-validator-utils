export = validate;
/**
 * @name ValidateRequest
 * @function
 * @param {*} value Value we want to validate
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {string} contentType Content api of the request we want to validate
 */
/**
 * @name ValidateParams
 * @function
 * @param {*} value Value we want to validate
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {string} contentType Content api of the request we want to validate
 */
/**
 * @name ValidateResponse
 * @function
 * @param {*} value Value we want to validate
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {string} status OpenApi status we want to validate
 * @param {string} contentType Content api of the request we want to validate
 */
/**
 * @name IsRequestRequired
 * @function
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {string} contentType Content api of the request we want to validate
 */
/**
 * @name ValidateRequiredValues
 * @function
 * @param {*} value Values we want to see if are send as required parameters
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 */
/**
 * Validator methods
 * @typedef {object} ValidatorMethods
 * @property {ValidateRequest} validateRequest
 * @property {ValidateParams} validateQueryParam
 * @property {ValidateParams} validatePathParam
 * @property {ValidateParams} validateHeaderParam
 * @property {ValidateResponse} validateResponse
 * @property {IsRequestRequired} isRequestRequired
 * @property {ValidateRequiredValues} validateRequiredValues
 */
/**
 * Validate method
 * @param {object} openApiDef OpenAPI definition
 * @param {object} options Options to extend the errorHandler or Ajv configuration
 * @returns {ValidatorMethods} validator methods
 */
declare function validate(openApiDef: object, userOptions?: {}): ValidatorMethods;
declare namespace validate {
    export { ValidatorMethods };
}
/**
 * Validator methods
 */
type ValidatorMethods = {
    validateRequest: any;
    validateQueryParam: any;
    validatePathParam: any;
    validateHeaderParam: any;
    validateResponse: any;
    isRequestRequired: any;
    validateRequiredValues: any;
};
