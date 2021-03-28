const validator = require('../..');
const mock = require('./mock.json');

/**
 * All the endpoints we are using, you can find them in the fake-server.js file
 * And the OpenAPI JSON in the mock.json
 */

describe('ValidateRequest method', () => {
  const { validateRequest } = validator(mock);
  describe('validate method args', () => {
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

  describe('validate OpenAPI endpoint', () => {
    it('should validate basic string type', () => {
      const result = validateRequest('valid string', '/api/v1/name', 'post');
      expect(result).toBeTruthy();
    });

    it('should validate object type with reference', () => {
      const result = validateRequest({ title: 'example' }, '/api/v1/songs', 'post');
      expect(result).toBeTruthy();
    });

    it('should throw errors when basic type is not valid', () => {
      expect(() => {
        validateRequest(false, '/api/v1/name', 'post');
      }).toThrow('Error in request: should be string. You provide "false"');
    });

    it('should throw errors when reference type is not valid', () => {
      expect(() => {
        validateRequest(false, '/api/v1/albums', 'post');
      }).toThrow('Error in request: should be array. You provide "false"');
    });

    it('should throw errors when reference type is not valid as an empty array', () => {
      expect(() => {
        validateRequest([{ invalidKey: 'nonValid' }], '/api/v1/albums', 'post');
      }).toThrow('Error in request: should have required property \'title\'. You provide "[{"invalidKey":"nonValid"}]"');
    });
  });
});
