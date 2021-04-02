const Ajv = require('ajv').default;
const {
  formatReferences,
  recursiveOmit,
  errors,
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
 * Validate method
 * @param {object} openApiDef OpenAPI definition
 * @param {object} options Options to extend the errorHandler or Ajv configuration
 */
const validate = (openApiDef, options = {}) => {
  const { valid: inputParameterValid, errorMessage } = inputValidation(openApiDef);
  const errorHandler = options ? options.errorHandler : null;
  if (!inputParameterValid) {
    throw errors.configuration(errorMessage, errorHandler);
  }
  const {
    valid: optionsValid, errorMessage: optionsErrorMessage,
  } = optionsValidation(options);
  if (!optionsValid) {
    throw errors.configuration(optionsErrorMessage, errorHandler);
  }
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

  const schemaValidation = (value, schema, type) => {
    const validateSchema = ajv.compile(schema);
    const valid = validateSchema(value);
    if (!valid) return ajvErrors(validateSchema.errors, value, type, errorHandler);
    return true;
  };

  const validateResponse = (value, endpoint, method, status, contentType = 'application/json') => {
    const {
      valid: validArgs, errorMessage: argsErrorMessage,
    } = responseArgsValidation(value, endpoint, method, status);
    if (!validArgs) {
      throw errors.configuration(argsErrorMessage, errorHandler);
    }
    const {
      valid: validEndpoint, errorMessage: endpointErrorMessage,
    } = endpointValidation.response(openApiDef, endpoint, method, status, contentType);
    if (!validEndpoint) {
      throw errors.configuration(endpointErrorMessage, errorHandler);
    }
    let requestBodySchema = {
      ...openApiDef.paths[endpoint][method].responses[status].content[contentType].schema,
    };
    requestBodySchema = formatReferences(requestBodySchema);
    return schemaValidation(value, requestBodySchema, 'response');
  };

  const validateRequest = (value, endpoint, method, contentType = 'application/json') => {
    const {
      valid: validArgs, errorMessage: argsErrorMessage,
    } = argsValidation(value, endpoint, method);
    if (!validArgs) {
      throw errors.configuration(argsErrorMessage, errorHandler);
    }
    const {
      valid: validEndpoint, errorMessage: endpointErrorMessage,
    } = endpointValidation.request(openApiDef, endpoint, method, contentType);
    if (!validEndpoint) {
      throw errors.configuration(endpointErrorMessage, errorHandler);
    }
    let requestBodySchema = {
      ...openApiDef.paths[endpoint][method].requestBody.content[contentType].schema,
    };
    requestBodySchema = formatReferences(requestBodySchema);
    return schemaValidation(value, requestBodySchema, 'request');
  };

  const validateParam = type => (value, key, endpoint, method) => {
    const {
      valid: validArgs, errorMessage: argsErrorMessage,
    } = argsValidation(value, endpoint, method, key);
    if (!validArgs) {
      throw errors.configuration(argsErrorMessage, errorHandler);
    }
    const {
      valid: validEndpoint, errorMessage: endpointErrorMessage, parameter,
    } = endpointValidation.params(openApiDef, endpoint, method, key, type);
    if (!validEndpoint) {
      throw errors.configuration(endpointErrorMessage, errorHandler);
    }
    let parametersSchema = parameter.schema;
    parametersSchema = formatReferences(parametersSchema);
    return schemaValidation(value, parametersSchema, 'params');
  };

  return {
    validateRequest,
    validateQueryParam: validateParam('query'),
    validatePathParam: validateParam('path'),
    validateHeaderParam: validateParam('header'),
    validateResponse,
  };
};

module.exports = validate;
