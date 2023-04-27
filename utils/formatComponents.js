const formatReferences = require('./formatReferences');

/** @module Utils/formatComponents */

/**
 * This method removes mapping from oneOf discriminator definitions
 * @param obj
 * @param parent
 * @returns {*}
 */
const removeDiscriminatorMapping = (obj, parent) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const prop in obj) {
    if (parent === 'discriminator' && prop === 'mapping') {
      // eslint-disable-next-line no-param-reassign
      delete obj[prop];
    } else if (typeof obj[prop] === 'object') {
      removeDiscriminatorMapping(obj[prop], prop);
    }
  }
  return obj;
};

/**
 * This methods adds on each component reference the additionalProperties value
 * @param {object} components OpenAPI components definition
 */
const includeAdditionalProperties = components => {
  const { schemas } = components;
  const extendedSchemas = Object.keys(schemas).reduce((acum, key) => ({
    ...acum,
    [key]: {
      ...schemas[key],
      additionalProperties: schemas[key].additionalProperties || false,
    },
  }), {});
  return {
    ...components,
    schemas: extendedSchemas,
  };
};

/**
 * Method to format OpenAPI Components definition
 * @param {object} components OpenAPI components definition
 * @param {object} options Options to increase validation "strictValidation"
 */
const formatComponents = (components, options = {}) => {
  let newComponents = formatReferences(components);
  if (options) {
    if (options.strictValidation) {
      newComponents = includeAdditionalProperties(newComponents);
    }
    if (!options.discriminatorMappingSupported) {
      newComponents = removeDiscriminatorMapping(newComponents);
    }
  }
  return newComponents;
};

module.exports = formatComponents;
