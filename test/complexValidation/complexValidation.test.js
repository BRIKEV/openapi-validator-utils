const validator = require('../..');
const mock = require('./mock.json');

/**
 * All the endpoints we are using, you can find them in the fake-server.js file
 * And the OpenAPI JSON in the mock.json
 */
describe('ValidateRequest method', () => {
  const { validateRequest, validateResponse, validateQueryParam } = validator(mock);
  it('throw an error when validating form params', () => {
    expect(() => {
      validateRequest({ id: 'id' }, '/api/v1/song', 'post', 'application/x-www-form-urlencoded');
    }).toThrow('Error in request: must have required property \'title\'. You provide "{"id":"id"}"');
  });

  // We have to skip this test until this issue is solved https://github.com/ajv-validator/ajv-formats/issues/25
  it.skip('validate form-data params', () => {
    expect(() => {
      validateRequest({ id: 'id' }, '/api/v1/album', 'post', 'multipart/form-data');
    }).toThrow('Error in request: should have required property \'title\'. You provide "{"id":"id"}"');
  });

  it('validate date type with $ref object', () => {
    expect(() => {
      validateResponse({
        title: 'valid',
        release: 'invalid date',
      }, '/api/v1/songs/{id}', 'get', 200);
    }).toThrow('Error in response: Schema SongResponse/properties/release must match format "date". You provide "{"title":"valid","release":"invalid date"}"');
  });

  describe('String types', () => {
    it('validate date type', () => {
      expect(() => {
        validateQueryParam('invalidDate', 'id', '/api/v1/date', 'get');
      }).toThrow('Error in query: must match format "date". You provide "invalidDate"');
    });

    it('should not return error with date type', () => {
      const result = validateQueryParam('2017-07-21', 'id', '/api/v1/date', 'get');
      expect(result).toBeTruthy();
    });

    it('should not return with email', () => {
      const result = validateQueryParam('test@test.com', 'email', '/api/v1/date', 'get');
      expect(result).toBeTruthy();
    });
  });

  describe('validate combined schemas', () => {
    it('should throw an error when validating combined schemas', () => {
      expect(() => {
        validateResponse({ id: 'id' }, '/api/v1/song/{id}', 'get', 200, 'application/json');
      }).toThrow('Error in response: Schema IntrumentalSong must have required property \'title\', Schema PopSong must have required property \'title\', must match exactly one schema in oneOf. You provide "{"id":"id"}"');
    });

    it('should throw an error when validating combined inside a different schemas', () => {
      expect(() => {
        validateResponse({ value: false }, '/api/v1/internal/reference', 'get', 200, 'application/json');
      }).toThrow('Error in response: must be string, must be number, Schema CustomError must be object, must match exactly one schema in oneOf, Schema PopSong must have required property \'title\', must match exactly one schema in oneOf. You provide "{"value":false}"');
    });

    it('should not throw an error when validating combined inside a different schemas', () => {
      let result = validateResponse({ title: 'title' }, '/api/v1/internal/reference', 'get', 200, 'application/json');
      expect(result).toBeTruthy();
      result = validateResponse({ value: 1 }, '/api/v1/internal/reference', 'get', 200, 'application/json');
      expect(result).toBeTruthy();
      result = validateResponse({ value: { message: 'valid message' } }, '/api/v1/internal/reference', 'get', 200, 'application/json');
      expect(result).toBeTruthy();
    });
  });
});
