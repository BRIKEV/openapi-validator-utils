/** @module Utils/responseBuilder */

/**
 * Builder return validation
 * @typedef {object} BuilderResponse
 * @property {boolean} valid
 * @property {string} errorMessage
 */

/**
 * This methods creates a common payload for the "validators"
 * @param {boolean} valid
 * @param {string} errorMessage
 * @returns {BuilderResponse}
 */
const responseBuilder = (valid, errorMessage = '') => ({
  valid,
  errorMessage,
});

module.exports = responseBuilder;
