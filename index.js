const Ajv = require('ajv').default;
const addFormats = require('ajv-formats');
const {
  formatReferences,
  recursiveOmit,
  configError,
} = require('./utils');
const {
  argsValidation,
  ajvErrors,
  inputValidation,
  endpointValidation,
  optionsValidation,
  responseArgsValidation,
} = require('./validators');

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
 * Validator methods
 * @typedef {object} ValidatorMethods
 * @property {ValidateRequest} validateRequest
 * @property {ValidateParams} validateQueryParam
 * @property {ValidateParams} validatePathParam
 * @property {ValidateParams} validateHeaderParam
 * @property {ValidateResponse} validateResponse
 */

/**
 * Validate method
 * @param {object} openApiDef OpenAPI definition
 * @param {object} options Options to extend the errorHandler or Ajv configuration
 * @returns {ValidatorMethods} validator methods
 */
const validate = (openApiDef, options = {}) => {
  const inputValidationError = inputValidation(openApiDef);
  const errorHandler = options ? options.errorHandler : null;
  configError(inputValidationError, errorHandler);
  const optionsValidationError = optionsValidation(options);
  configError(optionsValidationError, errorHandler);
  const defsSchema = {
    $id: 'defs.json',
    definitions: {
      components: recursiveOmit(openApiDef.components),
    },
  };
  const ajv = new Ajv({
    schemas: [defsSchema],
    ...(options.ajvConfig || {}),
  });
  addFormats(ajv);

  const schemaValidation = (value, schema, type) => {
    const validateSchema = ajv.compile(schema);
    const valid = validateSchema(value);
    if (!valid) return ajvErrors(validateSchema.errors, value, type, errorHandler);
    return true;
  };

  const validateRequiredValues = (values, endpoint, method) => {
    const argsValidationError = argsValidation(values, endpoint, method);
    configError(argsValidationError, errorHandler);
    const requiredParamsError = endpointValidation.requiredParams(
      values,
      openApiDef,
      endpoint,
      method,
    );
    configError(requiredParamsError, errorHandler);
    return true;
  };

  const validateResponse = (value, endpoint, method, status, contentType = 'application/json') => {
    const argsValidationError = responseArgsValidation(value, endpoint, method, status);
    configError(argsValidationError, errorHandler);
    const responseEndpoint = endpointValidation.response(
      openApiDef,
      endpoint,
      method,
      status,
      contentType,
    );
    configError(responseEndpoint, errorHandler);
    let responseSchema = {
      ...openApiDef.paths[endpoint][method].responses[status].content[contentType].schema,
    };
    responseSchema = formatReferences(responseSchema);
    return schemaValidation(value, responseSchema, 'response');
  };

  const validateRequest = (value, endpoint, method, contentType = 'application/json') => {
    const argsValidationError = argsValidation(value, endpoint, method);
    configError(argsValidationError, errorHandler);
    const requestEndpoint = endpointValidation.request(openApiDef, endpoint, method, contentType);
    configError(requestEndpoint, errorHandler);
    let requestBodySchema = {
      ...openApiDef.paths[endpoint][method].requestBody.content[contentType].schema,
    };
    requestBodySchema = formatReferences(requestBodySchema);
    return schemaValidation(value, requestBodySchema, 'request');
  };

  const validateParam = type => (value, key, endpoint, method) => {
    const argsValidationError = argsValidation(value, endpoint, method, key);
    configError(argsValidationError, errorHandler);
    const paramEndpoint = endpointValidation.params(openApiDef, endpoint, method, key, type);
    configError(paramEndpoint, errorHandler);
    let parametersSchema = paramEndpoint.parameter.schema;
    parametersSchema = formatReferences(parametersSchema);
    return schemaValidation(value, parametersSchema, type);
  };

  return {
    validateRequest,
    validateQueryParam: validateParam('query'),
    validatePathParam: validateParam('path'),
    validateHeaderParam: validateParam('header'),
    validateResponse,
    validateRequiredValues,
  };
};

module.exports = validate;
