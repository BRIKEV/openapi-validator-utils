const validator = require('../..');
const mock = require('./mock.json');

/**
 * All the endpoints we are using, you can find them in the fake-server.js file
 * And the OpenAPI JSON in the mock.json
 */
describe('validateRequiredValues method', () => {
  const { validateRequiredValues } = validator(mock);
  describe('validate method args', () => {
    it('validate when "value" is not send', () => {
      expect(() => {
        validateRequiredValues();
      }).toThrow('Value: "undefined" is required');
    });

    it('validate when "endpoint" is not send', () => {
      expect(() => {
        validateRequiredValues('value');
      }).toThrow('Endpoint: "undefined" is required');
    });

    it('validate when "method" is not send', () => {
      expect(() => {
        validateRequiredValues('value', 'key');
      }).toThrow('Method: "undefined" is not valid');
    });
  });

  describe('validate OpenAPI endpoint', () => {
    it('should throw errors when values is not an array', () => {
      expect(() => {
        validateRequiredValues('value', '/api/v1', 'get');
      }).toThrow('requiredParams values method expects an array');
    });

    it('should throw errors when endpoint does not exist', () => {
      expect(() => {
        validateRequiredValues(['value'], '/api/v1/non-valid-endpoint', 'get');
      }).toThrow('Endpoint: "/api/v1/non-valid-endpoint" not found in the OpenAPI definition');
    });

    it('should throw errors when endpoint\'s method does not exist', () => {
      expect(() => {
        validateRequiredValues(['value'], '/api/v1', 'put');
      }).toThrow('Method: "put" not found in the OpenAPI definition for "/api/v1" endpoint');
    });

    it('should not throw error when we send the required properties', () => {
      const result = validateRequiredValues([{ name: 'value' }], '/api/v1', 'get');
      expect(result).toBeTruthy();
    });

    it('should throw errors required key is not added', () => {
      expect(() => {
        validateRequiredValues(['nonValid'], '/api/v1', 'get');
      }).toThrow('Required error: name query param is required.');
    });

    it('should throw errors when path key is undefined', () => {
      expect(() => {
        const values = [
          { id: 'undefined' },
          { name: 'value' },
        ];
        validateRequiredValues(values, '/api/v1/albums/{id}', 'get');
      }).toThrow('Required error: id path param is required.');
    });

    it('should throw multiple errors message when multiple params are not valid', () => {
      expect(() => {
        const values = [
          { id: 'undefined' },
          { missingKey: 'value' },
        ];
        validateRequiredValues(values, '/api/v1/albums/{id}', 'get');
      }).toThrow('Required error: name query param is required. id path param is required.');
    });
  });
});

describe('validateRequiredValues method with custom Handler', () => {
  const customErrorCallback = jest.fn();
  const { validateRequiredValues } = validator(mock, {
    errorHandler: customErrorCallback,
  });
  describe('validate OpenAPI endpoint', () => {
    it('should throw errors when basic type is not valid', () => {
      try {
        const values = [
          { id: 'undefined' },
          { name: 'value' },
        ];
        validateRequiredValues(values, '/api/v1/albums/{id}', 'get');
      } catch (err) {
        expect(customErrorCallback).toHaveBeenCalledWith(
          'Required error: id path param is required.',
          undefined,
        );
      }
    });

    it('should throw errors when type is not an enum value', () => {
      try {
        const values = [
          { id: 'undefined' },
          { missingKey: 'value' },
        ];
        validateRequiredValues(values, '/api/v1/albums/{id}', 'get');
      } catch (err) {
        expect(customErrorCallback).toHaveBeenCalledWith(
          'Required error: name query param is required. id path param is required.',
          undefined,
        );
      }
    });
  });
});
