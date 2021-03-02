const Ajv = require('ajv').default;
const {
  formatReferences,
  recursiveOmit,
  inputValidation,
  errors,
} = require('./utils');

const validate = swaggerObject => {
  const { valid: inputParameterValid, errorMessage } = inputValidation(swaggerObject);
  if (!inputParameterValid) {
    throw errors.basicError(errorMessage);
  }
  const defsSchema = {
    $id: 'defs.json',
    definitions: {
      components: recursiveOmit(swaggerObject.components),
    },
  };
  const ajv = new Ajv({
    schemas: [defsSchema],
  });

  const schemaValidation = (value, schema) => {
    const validateSchema = ajv.compile(schema);
    const valid = validateSchema(value);
    if (!valid) return console.log(validateSchema.errors);
    console.log('no errors');
    return console.log(valid);
  };

  const validateRequest = (value, endpoint, method, contentType = 'application/json') => {
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

validate();

module.exports = validate;
