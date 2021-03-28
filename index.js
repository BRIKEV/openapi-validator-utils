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
} = require('./validators');

const validate = (swaggerObject, options = {}) => {
  const { valid: inputParameterValid, errorMessage } = inputValidation(swaggerObject);
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
      components: recursiveOmit(swaggerObject.components),
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

  const validateRequest = (value, endpoint, method, contentType = 'application/json') => {
    const {
      valid: validArgs, errorMessage: argsErrorMessage,
    } = argsValidation(value, endpoint, method);
    if (!validArgs) {
      throw errors.configuration(argsErrorMessage, errorHandler);
    }
    const {
      valid: validEndpoint, errorMessage: endpointErrorMessage,
    } = endpointValidation.request(swaggerObject, endpoint, method, contentType);
    if (!validEndpoint) {
      throw errors.configuration(endpointErrorMessage, errorHandler);
    }
    let requestBodySchema = {
      ...swaggerObject.paths[endpoint][method].requestBody.content[contentType].schema,
    };
    requestBodySchema = formatReferences(requestBodySchema);
    return schemaValidation(value, requestBodySchema, 'request');
  };

  const validateParam = type => (value, key, endpoint, method) => {
    const parameter = swaggerObject.paths[endpoint][method].parameters
      .filter(({ in: paramType }) => paramType === type)
      .find(({ name }) => name === key);
    if (!parameter) return console.log('Missing parameter');
    let parametersSchema = parameter.schema;
    parametersSchema = formatReferences(parametersSchema);
    return schemaValidation(value, parametersSchema);
  };

  return {
    validateRequest,
    validateQueryParam: validateParam('query'),
    validatePathParam: validateParam('path'),
    validateHeaderParam: validateParam('header'),
  };
};

module.exports = validate;
