const Ajv = require('ajv').default;
const {
  formatReferences,
  recursiveOmit,
  inputValidation,
  optionsValidation,
  errors,
} = require('./utils');

const validate = (swaggerObject, options = {}) => {
  const { valid: inputParameterValid, errorMessage } = inputValidation(swaggerObject);
  const errorHandler = options ? options.errorHandler : null;
  if (!inputParameterValid) {
    throw errors.basicError(errorMessage, errorHandler);
  }
  const {
    valid: optionsValid, errorMessage: optionsErrorMessage,
  } = optionsValidation(options);
  if (!optionsValid) {
    throw errors.basicError(optionsErrorMessage, errorHandler);
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

  const schemaValidation = (value, schema) => {
    const validateSchema = ajv.compile(schema);
    const valid = validateSchema(value);
    if (!valid) return console.log(validateSchema.errors);
    console.log('no errors');
    return console.log(valid);
  };

  const validateRequest = (value, endpoint, method, contentType = 'application/json') => {
    const {
      valid: validArgs, errorMessage: argsErrorMessage,
    } = validateArgs(value, endpoint, method);
    if (!optionsValid) {
      throw errors.basicError(optionsErrorMessage, errorHandler);
    }
    let requestBodySchema = {
      ...swaggerObject.paths[endpoint][method].requestBody.content[contentType].schema,
    };
    requestBodySchema = formatReferences(requestBodySchema);
    return schemaValidation(value, requestBodySchema);
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
