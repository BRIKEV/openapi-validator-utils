const { cloneDeep, isPlainObject } = require('lodash');

const EXCEPTIONS = ['oneOf', 'allOf', 'anyOf'];

/** @module Utils/formatReferences */

/**
 * This function removes the default $ref from the OpenAPI key
 * to use a valid one so the Ajv validator works
 * @param {string} key openapi object key
 * @param {(string|object[])} value value to replace when the key is a $ref key
 * @returns {object}
 */
const formatRefKey = (key, value) => {
  if (key === '$ref' && value) {
    return { $ref: value.replace('#/', 'defs.json#/definitions/') };
  }
  return {};
};

const formatExceptions = (key, values) => {
  if (EXCEPTIONS.includes(key)) {
    return {
      [key]: values
        .map(value => formatRefKey('$ref', value.$ref))
        .filter(({ $ref }) => $ref),
    };
  }
  return {};
};

/**
 * This method modifies all the references in the OpenAPI code
 * @param {object} OpenAPI definition to format
 * @returns {object}
 */
const formatReferences = payload => {
  const newObject = cloneDeep(payload);
  return Object.keys(newObject).reduce((acum, key) => (
    {
      ...acum,
      [key]: isPlainObject(newObject[key]) ? formatReferences(newObject[key]) : newObject[key],
      ...formatRefKey(key, newObject[key]),
      ...formatExceptions(key, newObject[key]),
    }
  ), {});
};

module.exports = formatReferences;
