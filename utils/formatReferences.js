const { cloneDeep, isPlainObject } = require('lodash');

/** @module Utils/formatReferences */

/**
 * This function removes the default $ref from the OpenAPI key
 * to use a valid one so the Ajv validator works
 * @param {string} key openapi object key
 * @param {string} value value to replace when the key is a $ref key
 */
const formatRefKey = (key, value) => {
  if (key === '$ref') {
    return { $ref: value.replace('#/', 'defs.json#/definitions/') };
  }
  return {};
};

/**
 * This method modifies all the references in the OpenAPI code
 * @param {object} OpenAPI definition to format
 */
const formatReferences = payload => {
  const newObject = cloneDeep(payload);
  return Object.keys(newObject).reduce((acum, key) => (
    {
      ...acum,
      [key]: isPlainObject(newObject[key]) ? formatReferences(newObject[key]) : newObject[key],
      ...formatRefKey(key, newObject[key]),
    }
  ), {});
};

module.exports = formatReferences;
