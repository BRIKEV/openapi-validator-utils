const responseBuilder = (valid, errorMessage = '') => ({
  valid,
  errorMessage,
});

const common = (definition, endpoint, method) => {
  if (!definition.paths[endpoint]) {
    return responseBuilder(false, `Endpoint: "${endpoint}" not found in the OpenAPI definition`);
  }
  if (!definition.paths[endpoint][method]) {
    return responseBuilder(false, `Method: "${method}" not found in the OpenAPI definition for "${endpoint}" endpoint`);
  }
  return responseBuilder(true);
};

const request = (definition, endpoint, method, contentType) => {
  const commonValidation = common(definition, endpoint, method);
  if (!commonValidation.valid) {
    return commonValidation;
  }
  if (!definition.paths[endpoint][method].requestBody) {
    return responseBuilder(false, `Method: "${method}" and Endpoint: "${endpoint}" does not have requestBody definition`);
  }
  if (!definition.paths[endpoint][method].requestBody.content[contentType]) {
    return responseBuilder(false, `Method: "${method}" and Endpoint: "${endpoint}" does not have requestBody with this ContentType: "${contentType}"`);
  }
  if (!definition.paths[endpoint][method].requestBody.content[contentType].schema) {
    return responseBuilder(false, `Schema not found for Method: "${method}" Endpoint: "${endpoint}" with ContentType: "${contentType}" requestBody`);
  }
  return responseBuilder(true);
};

const params = (definition, endpoint, method, key, type) => {
  const commonValidation = common(definition, endpoint, method);
  if (!commonValidation.valid) {
    return commonValidation;
  }
  if (!definition.paths[endpoint][method].parameters) {
    return responseBuilder(false, `Method: "${method}" and Endpoint: "${endpoint}" does not have params definition`);
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

const response = (definition, endpoint, method, status, contentType) => {
  const commonValidation = common(definition, endpoint, method);
  if (!commonValidation.valid) {
    return commonValidation;
  }
  if (!definition.paths[endpoint][method].responses) {
    return responseBuilder(false, `Method: "${method}" and Endpoint: "${endpoint}" does not have responses definition`);
  }
  if (!definition.paths[endpoint][method].responses[status]) {
    return responseBuilder(false, `Status: "${status}" not found in the OpenAPI definition for Method: "${method}" and Endpoint: "${endpoint}"`);
  }
  if (!definition.paths[endpoint][method].responses[status].content[contentType]) {
    return responseBuilder(false, `Method: "${method}" and Endpoint: "${endpoint}" does not have responses with this ContentType: "${contentType}"`);
  }
  if (!definition.paths[endpoint][method].responses[status].content[contentType].schema) {
    return responseBuilder(false, `Schema not found for Method: "${method}" Endpoint: "${endpoint}" with ContentType: "${contentType}" requestBody`);
  }
  return responseBuilder(true);
};

module.exports = { request, params, response };
