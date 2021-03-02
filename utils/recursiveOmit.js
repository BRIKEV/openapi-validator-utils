const { cloneDeep, isPlainObject, omit } = require('lodash');

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
