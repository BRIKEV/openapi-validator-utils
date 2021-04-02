const { cloneDeep, isPlainObject, omit } = require('lodash');

/** @module Utils/recursiveOmit */

/**
 * This method allows you to exclude some keys from an object recursively
 * @param {object} data object we want to exclude some keys
 * @param {string} excluded value to exclude from the object
 * @returns {object}
 */
const recursiveOmit = (data, excluded) => {
  const newObject = cloneDeep(data);
  return Object.keys(newObject).reduce((acum, key) => {
    const value = newObject[key];
    return omit({
      ...acum,
      [key]: isPlainObject(value) ? recursiveOmit(value, excluded) : value,
    }, excluded);
  }, {});
};

module.exports = recursiveOmit;
