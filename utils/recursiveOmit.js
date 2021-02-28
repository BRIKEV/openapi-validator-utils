const { cloneDeep, isPlainObject, omit } = require('lodash');

const recursiveOmit = (data, excluded) => {
  const newObject = cloneDeep(data);
  return Object.keys(newObject).reduce((acum, key) => (
    omit({
      ...acum,
      [key]: isPlainObject(newObject[key]) ? recursiveOmit(newObject[key], excluded) : newObject[key],
    }, excluded)
  ), {});
};

module.exports = recursiveOmit;
