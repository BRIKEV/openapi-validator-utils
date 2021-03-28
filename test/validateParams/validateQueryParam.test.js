const validator = require('../..');
const mock = require('./mock.json');

/**
 * All the endpoints we are using, you can find them in the fake-server.js file
 * And the OpenAPI JSON in the mock.json
 */
describe('validateQueryParam method', () => {
  const { validateQueryParam } = validator(mock);
  describe('validate method args', () => {
    it('validate when "value" is not send', () => {
      expect(() => {
        validateQueryParam();
      }).toThrow('Value: "undefined" is required');
    });

    it('validate when "endpoint" is not send', () => {
      expect(() => {
        validateQueryParam('value', 'key');
      }).toThrow('Endpoint: "undefined" is required');
    });

    it('validate when "method" is not send', () => {
      expect(() => {
        validateQueryParam('value', 'key', 'endpoint');
      }).toThrow('Method: "undefined" is not valid');
    });

    it('validate when "key" is not send', () => {
      expect(() => {
        validateQueryParam('value', null, 'endpoint', 'get');
      }).toThrow('Key: "null" is not valid');
    });
  });

  describe('validate OpenAPI endpoint', () => {
    it('should throw errors when endpoint does not exist', () => {
      expect(() => {
        validateQueryParam('value', 'name', '/api/v1/non-valid-endpoint', 'get');
      }).toThrow('Endpoint: "/api/v1/non-valid-endpoint" not found in the OpenAPI definition');
    });

    it('should throw errors when endpoint\'s method does not exist', () => {
      expect(() => {
        validateQueryParam('value', 'name', '/api/v1', 'put');
      }).toThrow('Method: "put" not found in the OpenAPI definition for "/api/v1" endpoint');
    });

    it('should validate basic string type with the enum value', () => {
      const result = validateQueryParam('type1', 'name', '/api/v1', 'get');
      expect(result).toBeTruthy();
    });

    it('should throw errors when basic type is not valid', () => {
      expect(() => {
        validateQueryParam(false, 'name', '/api/v1', 'get');
      }).toThrow('Error in params: should be string. You provide "false"');
    });

    it.only('should throw errors when reference type is not valid', () => {
      expect(() => {
        validateQueryParam(1234, 'license', '/api/v1/albums', 'get');
      }).toThrow('Error in params: should be string. You provide "1234"');
    });

    it.skip('should throw errors when reference type is not valid as an empty array', () => {
      expect(() => {
        validateQueryParam([{ invalidKey: 'nonValid' }], '/api/v1/albums', 'post');
      }).toThrow('Error in request: should have required property \'title\'. You provide "[{"invalidKey":"nonValid"}]"');
    });
  });
});

describe.skip('validateQueryParam method with custom Handler', () => {
  const customErrorCallback = jest.fn();
  const { validateQueryParam } = validator(mock, {
    errorHandler: customErrorCallback,
  });
  describe('validate OpenAPI endpoint', () => {
    it('should throw errors when basic type is not valid', () => {
      try {
        validateQueryParam(false, '/api/v1/name', 'post');
      } catch (err) {
        expect(customErrorCallback).toHaveBeenCalledWith(
          'Error in request: should be string. You provide "false"',
          [{
            dataPath: '', keyword: 'type', message: 'should be string', params: { type: 'string' }, schemaPath: '#/type',
          }],
        );
      }
    });

    it('should throw errors when reference type is not valid', () => {
      try {
        validateQueryParam(false, '/api/v1/albums', 'post');
      } catch (err) {
        expect(customErrorCallback).toHaveBeenCalledWith(
          'Error in request: should be array. You provide "false"',
          [{
            dataPath: '', keyword: 'type', message: 'should be array', params: { type: 'array' }, schemaPath: '#/type',
          }],
        );
      }
    });

    it('should throw errors when reference type is not valid as an empty array', () => {
      try {
        validateQueryParam([{ invalidKey: 'nonValid' }], '/api/v1/albums', 'post');
      } catch (err) {
        expect(customErrorCallback).toHaveBeenCalledWith(
          'Error in request: should have required property \'title\'. You provide "[{"invalidKey":"nonValid"}]"',
          [{
            dataPath: '/0', keyword: 'required', message: "should have required property 'title'", params: { missingProperty: 'title' }, schemaPath: 'defs.json#/definitions/components/schemas/Song/required',
          }],
        );
      }
    });
  });
});
