const formatReferences = require('./formatReferences');

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

const formatComponents = (components, options = {}) => {
  let newComponents = formatReferences(components);
  if (options && options.strictValidation) {
    newComponents = includeAdditionalProperties(newComponents);
  }
  return newComponents;
};

module.exports = formatComponents;
