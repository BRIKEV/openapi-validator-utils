const { responseBuilder } = require('../utils');

/** @module Validators/endpointValidation */

/**
 * This method validates some common values
 * @param {object} definition OpenApi definition
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {string} type OpenAPI type [requestBody, responses, parameters]
 * @returns {BuilderResponse}
 */
const common = (definition, endpoint, method, type) => {
  if (!definition.paths[endpoint]) {
    return responseBuilder(false, `Endpoint: "${endpoint}" not found in the OpenAPI definition`);
  }
  if (!definition.paths[endpoint][method]) {
    return responseBuilder(false, `Method: "${method}" not found in the OpenAPI definition for "${endpoint}" endpoint`);
  }
  if (!definition.paths[endpoint][method][type]) {
    return responseBuilder(false, `Method: "${method}" and Endpoint: "${endpoint}" does not have ${type} definition`);
  }
  return responseBuilder(true);
};

/**
 * @param {string} value schema value
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {string} contentType Content api of the request we want to validate
 * @param {string} type OpenAPI type [requestBody, responses]
 */
const schemaValidation = (value, method, endpoint, contentType, type) => {
  if (!value) {
    return responseBuilder(false, `Schema not found for Method: "${method}" Endpoint: "${endpoint}" with ContentType: "${contentType}" ${type}`);
  }
  return responseBuilder(true);
};

/**
 * This method validates request info
 * @param {object} definition OpenApi definition
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {string} contentType Content api of the request we want to validate
 * @returns {BuilderResponse}
 */
const request = (definition, endpoint, method, contentType) => {
  const commonValidation = common(definition, endpoint, method, 'requestBody');
  if (!commonValidation.valid) {
    return commonValidation;
  }
  if (!definition.paths[endpoint][method].requestBody.content[contentType]) {
    return responseBuilder(false, `Method: "${method}" and Endpoint: "${endpoint}" does not have requestBody with this ContentType: "${contentType}"`);
  }
  return schemaValidation(
    definition.paths[endpoint][method].requestBody.content[contentType].schema,
    method,
    endpoint,
    'requestBody',
  );
};

/**
 * This method validates params info
 * @param {object} definition OpenApi definition
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {string} key OpenApi key we want to validate
 * @param {string} type OpenApi type we want to validate
 * @returns {BuilderResponse}
 */
const params = (definition, endpoint, method, key, type) => {
  const commonValidation = common(definition, endpoint, method, 'parameters');
  if (!commonValidation.valid) {
    return commonValidation;
  }
  const parameter = definition.paths[endpoint][method].parameters
    .filter(({ in: paramType }) => paramType === type)
    .find(({ name }) => name === key);
  if (!parameter) {
    return responseBuilder(
      false,
      `Missing ${type} parameter: ${key} in Method: "${method}" and Endpoint: "${endpoint}" `,
    );
  }
  return {
    ...responseBuilder(true),
    parameter,
  };
};

/**
 * This method validates required params
 * @param {object[]} values Values we want to validate
 * @param {object} definition OpenApi definition
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @returns {BuilderResponse}
 */
const requiredParams = (values, definition, endpoint, method) => {
  const commonValidation = common(definition, endpoint, method, 'requiredParams');
  if (!commonValidation.valid) {
    return commonValidation;
  }
  const { parameters } = definition.paths[endpoint][method];
  const DEFAULT_ERROR_VALUE = '';
  const errors = parameters.reduce((acum, parameter) => {
    let errorMessage = DEFAULT_ERROR_VALUE;
    if (parameter.required) {
      const exists = values.find(({ key }) => key === parameter.name);
      errorMessage = !exists ? `Required ${parameter.in} param ${parameter.name}` : DEFAULT_ERROR_VALUE;
    }
    return `${acum} ${errorMessage}`;
  }, DEFAULT_ERROR_VALUE);
  if (errors !== DEFAULT_ERROR_VALUE) return responseBuilder(false, errors);
  return responseBuilder(true);
};

/**
 * This method validates responses info
 * @param {object} definition OpenApi definition
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {string} status OpenApi status we want to validate
 * @param {string} contentType Content api of the request we want to validate
 * @returns {BuilderResponse}
 */
const response = (definition, endpoint, method, status, contentType) => {
  const commonValidation = common(definition, endpoint, method, 'responses');
  if (!commonValidation.valid) {
    return commonValidation;
  }
  if (!definition.paths[endpoint][method].responses[status]) {
    return responseBuilder(false, `Status: "${status}" not found in the OpenAPI definition for Method: "${method}" and Endpoint: "${endpoint}"`);
  }
  if (!definition.paths[endpoint][method].responses[status].content[contentType]) {
    return responseBuilder(false, `Method: "${method}" and Endpoint: "${endpoint}" does not have responses with this ContentType: "${contentType}"`);
  }
  return schemaValidation(
    definition.paths[endpoint][method].responses[status].content[contentType].schema,
    method,
    endpoint,
    'response',
  );
};

module.exports = {
  request,
  params,
  response,
  requiredParams,
};
