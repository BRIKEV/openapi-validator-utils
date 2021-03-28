const errorMethod = require('./errorMethod');

const formatArrayError = errors => errors.map(({ message }) => message).join(', ');

const ajvErrors = (ajvError, value, type, handler) => {
  if (Array.isArray(ajvError)) {
    const message = formatArrayError(ajvError);
    throw errorMethod[type](`Error in ${type}: ${message}. You provide "${value}"`, handler, ajvError);
  }
};

module.exports = ajvErrors;
