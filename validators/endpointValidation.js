const responseBuilder = (valid, errorMessage = '') => ({
  valid,
  errorMessage,
});

const request = (definition, endpoint, method, contentType) => {
  if (!definition.paths[endpoint]) {
    return responseBuilder(false, `Endpoint: "${endpoint}" not found in the OpenAPI definition`);
  }
  if (!definition.paths[endpoint][method]) {
    return responseBuilder(false, `Method: "${method}" not found in the OpenAPI definition for "${endpoint}" endpoint`);
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

module.exports = { request };