const { iteratee } = require("lodash");
const validator = require('../..');
const mock = require('./mock.json');

describe('ValidateRequest method', () => {
  const { validateRequest } = validator(mock);
  it('validate when "value" is not send', () => {
    expect(() => {
      validateRequest();
    }).toThrow('errorHandler option must be a function');
  });
});
