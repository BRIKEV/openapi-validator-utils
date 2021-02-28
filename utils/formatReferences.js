const { cloneDeep, isPlainObject } = require('lodash');

const formatRefKey = (key, value) => {
  if (key === '$ref') {
    return { $ref: value.replace('#/', 'defs.json#/definitions/') };
  }
  return {};
};

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
