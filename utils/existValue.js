/** @module Utils/existValue */

/**
 * This function validates if the value exists. We also validate possible 'undefined' value.
 * to use a valid one so the Ajv validator works
 * @param {object} value object to validate
 * @param {string} key object key
 * @returns {boolean}
 */
const existValue = (value, key) => {
  if (!value) return false;
  return !(value[key] === 'undefined' || !value[key]);
};

module.exports = existValue;
