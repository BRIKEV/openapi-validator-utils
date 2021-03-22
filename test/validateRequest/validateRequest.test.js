const validator = require('../..');
const mock = require('./mock.json');

describe('ValidateRequest method', () => {
  const { validateRequest } = validator(mock);
  it('validate when "value" is not send', () => {
    expect(() => {
      validateRequest();
    }).toThrow('Value: "undefined" is required');
  });

  it('validate when "endpoint" is not send', () => {
    expect(() => {
      validateRequest('value');
    }).toThrow('Endpoint: "undefined" is required');
  });

  it('validate when "method" is not send', () => {
    expect(() => {
      validateRequest('value', 'endpoint');
    }).toThrow('Method: "undefined" is not valid');
  });
});
