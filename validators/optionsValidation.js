const { isPlainObject, isFunction } = require('lodash');
const { responseBuilder } = require('../utils');

const validOptions = ['ajvConfig', 'errorHandler'];

const optionsValidation = (options = {}) => {
  if (!isPlainObject(options)) {
    return responseBuilder(false, 'Options is not a valid JSON');
  }
  const extraOption = Object.keys(options).filter(option => !validOptions.includes(option));
  if (extraOption.length > 0) {
    return responseBuilder(false, `Only this props are valid: ${validOptions.join(', ')}`);
  }
  if (options.errorHandler && !isFunction(options.errorHandler)) {
    return responseBuilder(false, 'errorHandler option must be a function');
  }
  return responseBuilder(true);
};

module.exports = optionsValidation;
