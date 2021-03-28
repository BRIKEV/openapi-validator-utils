const { isPlainObject, isEmpty } = require('lodash');

const responseBuilder = (valid, errorMessage = '') => ({
  valid,
  errorMessage,
});

const inputValidation = swaggerInput => {
  if (!isPlainObject(swaggerInput)) {
    return responseBuilder(false, 'Input is not a valid JSON');
  }
  if (isEmpty(swaggerInput)) {
    return responseBuilder(false, 'Please provide a valid OpenAPI docs');
  }
  if (!swaggerInput.openapi) {
    return responseBuilder(false, 'OpenAPI definition must be 3.x version');
  }
  return responseBuilder(true);
};

module.exports = inputValidation;
