const formatReferences = require('./formatReferences');

/** @module Utils/formatComponents */

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
  if (options && options.strictValidation) {
    newComponents = includeAdditionalProperties(newComponents);
  }
  return newComponents;
};

module.exports = formatComponents;
