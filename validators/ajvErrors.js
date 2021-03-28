const isObject = require('lodash/isObject');
const errorMethod = require('../utils/errorMethod');

const enumValues = allowedValues => (
  allowedValues ? `: ${allowedValues.join(', ')}` : ''
);

const formatArrayError = errors => (
  errors.map(({ message, params }) => `${message}${enumValues(params.allowedValues)}`)
    .join(', ')
);

const ajvErrors = (ajvError, value, type, handler) => {
  const stringifyValue = isObject(value) ? JSON.stringify(value) : value;
  if (Array.isArray(ajvError)) {
    const message = formatArrayError(ajvError);
    throw errorMethod[type](
      `Error in ${type}: ${message}. You provide "${stringifyValue}"`,
      handler,
      ajvError,
    );
  }
};

module.exports = ajvErrors;
