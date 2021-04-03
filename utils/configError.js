const errors = require('./errorMethod');

/** @module Utils/configError */

/**
 * Description of the function
 * @name ErrorHandler
 * @function
 * @param {string} message Error message
 * @param {object} extra Ajv or extra error info
 */

/**
 * @param {BuilderResponse} error
 * @param {ErrorHandler} handler function to extend default behavior
 */
const configError = (error, handler) => {
  if (!error.valid) {
    throw errors.configuration(error.errorMessage, handler);
  }
};

module.exports = configError;
