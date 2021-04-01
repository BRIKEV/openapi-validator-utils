const { responseBuilder } = require('../utils');

const argsValidation = (value, endpoint, method, key) => {
  if (value === undefined) {
    return responseBuilder(false, `Value: "${value}" is required`);
  }
  if (!endpoint) {
    return responseBuilder(false, `Endpoint: "${endpoint}" is required`);
  }
  if (!method) {
    return responseBuilder(false, `Method: "${method}" is not valid`);
  }
  if (key !== undefined && !key) {
    return responseBuilder(false, `Key: "${key}" is not valid`);
  }
  return responseBuilder(true);
};

module.exports = argsValidation;
