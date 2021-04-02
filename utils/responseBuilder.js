/** @module Utils */

/**
 * This methods creates a common payload for the "validators"
 * @param {boolean} valid
 * @param {string} errorMessage
 */
const responseBuilder = (valid, errorMessage = '') => ({
  valid,
  errorMessage,
});

module.exports = responseBuilder;
