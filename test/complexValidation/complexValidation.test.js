const validator = require('../..');
const mock = require('./mock.json');

/**
 * All the endpoints we are using, you can find them in the fake-server.js file
 * And the OpenAPI JSON in the mock.json
 */
describe('ValidateRequest method', () => {
  const { validateRequest, validateResponse } = validator(mock);
  it('throw an error when validating form params', () => {
    expect(() => {
      validateRequest({ id: 'id' }, '/api/v1/song', 'post', 'application/x-www-form-urlencoded');
    }).toThrow('Error in request: should have required property \'title\'. You provide "{"id":"id"}"');
  });

  // We have to skip this test until this issue is solved https://github.com/ajv-validator/ajv-formats/issues/25
  it.skip('validate form-data params', () => {
    expect(() => {
      validateRequest({ id: 'id' }, '/api/v1/album', 'post', 'multipart/form-data');
    }).toThrow('Error in request: should have required property \'title\'. You provide "{"id":"id"}"');
  });

  describe('validate combined schemas', () => {
    it('throw an error when validating combined schemas', () => {
      expect(() => {
        validateResponse({ id: 'id' }, '/api/v1/song/{id}', 'get', 200, 'application/json');
      }).toThrow('rror in response: Schema IntrumentalSong should have required property \'title\', Schema PopSong should have required property \'title\', should match exactly one schema in oneOf. You provide "{"id":"id"}"');
    });
  });
});
