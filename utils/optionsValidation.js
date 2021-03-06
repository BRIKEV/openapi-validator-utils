const { isPlainObject, isFunction } = require('lodash');

const responseBuilder = (valid, errorMessage = '') => ({
  valid,
  errorMessage,
});

const validOptions = ['ajvConfig', 'errorHandler'];

const optionsValidation = options => {
  if (!options || !isPlainObject(options)) {
    return responseBuilder(false, 'Options is not a valid JSON');
  }
  const extraOption = Object.keys(options).filter(option => !validOptions.includes(option));
  if (extraOption.length > 0) {
    return responseBuilder(false, `Only this props are valid: ${validOptions.join(', ')}`);
  }
  if (!isFunction(options.errorHandler)) {
    return responseBuilder(false, 'errorHandler option must be a function');
  }
  return responseBuilder(true);
};

module.exports = optionsValidation;
