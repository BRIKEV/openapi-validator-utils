const commonArgsValidation = require('./argsValidation');
const { responseBuilder } = require('../utils');

const argsValidation = (value, endpoint, method, status) => {
  const commonValidation = commonArgsValidation(value, endpoint, method);
  if (!commonValidation.valid) {
    return commonValidation;
  }
  if (!status) {
    return responseBuilder(false, `Status: "${status}" is not valid`);
  }
  return responseBuilder(true);
};

module.exports = argsValidation;
