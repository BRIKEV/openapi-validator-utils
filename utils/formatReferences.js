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
        .map(value => {
          if (value.type) {
            return value;
          }
          return formatRefKey('$ref', value.$ref);
        })
        .filter(({ $ref, type }) => $ref || type),
    };
  }
  return {};
};

/**
 * Method to format nullable objects
 * When we receive and object like this:
 * {
 *   "objectReference": {
 *     "description": "",
 *     "nullable": true,
 *     "$ref": "#/components/schemas/ObjectReference"
 *   }
 * }
 * We format the object to use a valid AJV type
 * {
 *   "objectReference": {
 *     "description": "",
 *     "nullable": true,
 *     "anyOf": [
 *       {
 *         "$ref": "#/components/schemas/ObjectReference"
 *       },
 *       {
 *          "type": "null"
 *        }
 *     ]
 *   }
 * }
 * @param {object} OpenAPI definition to format
 */
const formatNullable = payload => {
  const { nullable, $ref, ...rest } = payload;
  if (nullable && $ref) {
    return {
      ...rest,
      anyOf: [
        { $ref },
        { type: 'null' },
      ],
    };
  }
  return payload;
};

/**
 * This method modifies all the references in the OpenAPI code
 * @param {object} OpenAPI definition to format
 * @returns {object}
 */
const formatReferences = payload => {
  const newObject = cloneDeep(payload);
  return Object.keys(newObject).reduce((acum, key) => (
    formatNullable({
      ...acum,
      [key]: isPlainObject(newObject[key]) ? formatReferences(newObject[key]) : newObject[key],
      ...formatRefKey(key, newObject[key]),
      ...formatExceptions(key, newObject[key]),
    })
  ), {});
};

module.exports = formatReferences;
