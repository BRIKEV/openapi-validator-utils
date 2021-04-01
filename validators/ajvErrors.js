const isObject = require('lodash/isObject');
const errorMethod = require('../utils/errorMethod');
const { formatSchemaMessage } = require('../utils');

const enumValues = allowedValues => (
  allowedValues ? `: ${allowedValues.join(', ')}` : ''
);

const arrayMessage = (message, schemaPath) => (
  schemaPath.includes('items') ? `Array ${message} items` : message
);

const formatArrayError = errors => (
  errors.map(({ message, params, schemaPath }) => `${arrayMessage(message, schemaPath)}${enumValues(params.allowedValues)}`)
    .join(', ')
);

const ajvErrors = (ajvError, value, type, handler) => {
  const stringifyValue = isObject(value) ? JSON.stringify(value) : value;
  if (Array.isArray(ajvError)) {
    const message = formatArrayError(ajvError);
    const isSchema = ajvError[0].schemaPath.includes('defs.json');
    const schemaMessage = isSchema ? formatSchemaMessage(ajvError[0].schemaPath) : '';
    throw errorMethod[type](
      `Error in ${type}${schemaMessage}: ${message}. You provide "${stringifyValue}"`,
      handler,
      ajvError,
    );
  }
};

module.exports = ajvErrors;
