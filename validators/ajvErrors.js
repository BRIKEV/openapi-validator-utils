const isObject = require('lodash/isObject');
const errorMethod = require('../utils/errorMethod');
const { formatSchemaMessage } = require('../utils');

/** @module Validators/ajvErrors */

/**
 * This method formats the text when receives enum values
 * @param {string[]} allowedValues allowed values from an enum description
 * @return {string} value formatted
 */
const enumValues = allowedValues => (
  allowedValues ? `: ${allowedValues.join(', ')}` : ''
);

/**
 * This method formats the message when schemaPath is an array
 * @param {string} message message to include when we receive an array
 * @param {string} schemaPath path to determine if it is an array
 * @return {string} value formatted
 */
const arrayMessage = (message, schemaPath) => (
  schemaPath.includes('items') ? `Array ${message} items` : message
);

/**
 * This methods format the AJV error
 * @param {object[]} errors Ajv errors
 * @returns {string} Error message
 */
const formatArrayError = errors => (
  errors.map(({ message, params, schemaPath }) => `${arrayMessage(message, schemaPath)}${enumValues(params.allowedValues)}`)
    .join(', ')
);

/**
 * Description of the function
 * @name ErrorHandler
 * @function
 * @param {string} message Error message
 * @param {object} extra Ajv or extra error info
*/

/**
 * This methods formats Ajv errors after validation
 * @param {object[]} ajvError Errors after validation
 * @param {(numeric|boolean|string)} value Any type value you try to validate
 * @param {string} type Type of validation, params, response or request
 * @param {ErrorHandler} handler function to extend default behavior
 */
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
