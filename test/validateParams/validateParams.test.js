const validator = require('../..');
const mock = require('./mock.json');

/**
 * All the endpoints we are using, you can find them in the fake-server.js file
 * And the OpenAPI JSON in the mock.json
 */
describe('validateParams method', () => {
  const { validateQueryParam, validatePathParam } = validator(mock);
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
      }).toThrow('Error in query: must be string. You provide "false"');
    });

    it('should throw errors when array of string type is not valid', () => {
      expect(() => {
        validateQueryParam(false, 'name', '/api/v1', 'get');
      }).toThrow('Error in query: must be string. You provide "false"');
    });

    it('should throw errors when basic type is not a valid value of the enum list', () => {
      expect(() => {
        validateQueryParam('test', 'name', '/api/v1', 'get');
      }).toThrow('Error in query: must be equal to one of the allowed values: type1, type2. You provide "test"');
    });

    it('should throw errors when multiple query params are not valid', () => {
      expect(() => {
        validateQueryParam(1234, 'license', '/api/v1/albums', 'get');
      }).toThrow('Error in query: must be string. You provide "1234"');
    });

    it('should throw errors with array invalid type', () => {
      expect(() => {
        validateQueryParam([1], 'name', '/api/v1/albums/{id}', 'get');
      }).toThrow('Error in query: Array must be string items. You provide "[1]"');
    });

    it('should throw errors when reference key is not found', () => {
      expect(() => {
        validateQueryParam('MIT', 'licenses', '/api/v1/albums', 'get');
      }).toThrow('Missing query parameter: licenses in Method: "get" and Endpoint: "/api/v1/albums"');
    });
  });

  describe('validate path param as number', () => {
    it('should validate basic number type with a number even if it is string', () => {
      const result = validatePathParam('1', 'name', '/api/v1/{id}', 'get');
      expect(result).toBeTruthy();
    });

    it('should throw error when path param is not valid', () => {
      expect(() => {
        validatePathParam('non-valid', 'name', '/api/v1/{id}', 'get');
      }).toThrow('Error in path: must be number. You provide "non-valid"');
    });

    it('should validate basic boolean type with a string boolean', () => {
      const result = validatePathParam('true', 'name', '/api/v2/{id}', 'get');
      expect(result).toBeTruthy();
    });

    it('should throw error when boolean path param is not valid', () => {
      expect(() => {
        validatePathParam('non-valid', 'name', '/api/v2/{id}', 'get');
      }).toThrow('Error in path: must be boolean. You provide "non-valid"');
    });

    it('should be valid. Param is defined at endpoint level', () => {
      expect(() => {
        validatePathParam(12345, 'id', '/api/v2/albums/{id}', 'get');
      }).toBeTruthy();
    });
    it('should throw error. no parameter definition at endpoint level', () => {
      expect(() => {
        validatePathParam(12345, 'id', '/api/v3/albums/{id}', 'get');
      }).toThrow('Method: "get" and Endpoint: "/api/v3/albums/{id}" does not have parameters definition');
    });
  });
});

describe('validateQueryParam method with custom Handler', () => {
  const customErrorCallback = jest.fn();
  const { validateQueryParam } = validator(mock, {
    errorHandler: customErrorCallback,
  });
  describe('validate OpenAPI endpoint', () => {
    it('should throw errors when basic type is not valid', () => {
      try {
        validateQueryParam(false, 'name', '/api/v1', 'get');
      } catch (err) {
        expect(customErrorCallback).toHaveBeenCalledWith(
          'Error in query: must be string. You provide "false"',
          [{
            instancePath: '', keyword: 'type', message: 'must be string', params: { type: 'string' }, schemaPath: '#/type',
          }],
        );
      }
    });

    it('should throw errors when type is not an enum value', () => {
      try {
        validateQueryParam('test', 'name', '/api/v1', 'get');
      } catch (err) {
        expect(customErrorCallback).toHaveBeenCalledWith(
          'Error in query: must be equal to one of the allowed values: type1, type2. You provide "test"',
          [{
            instancePath: '', keyword: 'enum', message: 'must be equal to one of the allowed values', params: { allowedValues: ['type1', 'type2'] }, schemaPath: '#/enum',
          }],
        );
      }
    });
  });
});
