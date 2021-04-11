const validator = require('../..');
const mock = require('./mock.json');

/**
 * All the endpoints we are using, you can find them in the fake-server.js file
 * And the OpenAPI JSON in the mock.json
 */
describe('isRequestRequired method', () => {
  const { isRequestRequired } = validator(mock);
  describe('validate method args', () => {
    it('validate when "endpoint" is not send', () => {
      expect(() => {
        isRequestRequired();
      }).toThrow('Endpoint: "undefined" is required');
    });

    it('validate when "method" is not send', () => {
      expect(() => {
        isRequestRequired('value');
      }).toThrow('Method: "undefined" is not valid');
    });
  });

  describe('validate OpenAPI endpoint', () => {
    it('should throw errors when endpoint does not exist', () => {
      expect(() => {
        isRequestRequired('/api/v1/non-valid-endpoint', 'post');
      }).toThrow('Endpoint: "/api/v1/non-valid-endpoint" not found in the OpenAPI definition');
    });

    it('should throw errors when endpoint\'s content-type does not exist', () => {
      expect(() => {
        isRequestRequired('/api/v1/name', 'post', 'html');
      }).toThrow('Method: "post" and Endpoint: "/api/v1/name" does not have requestBody with this ContentType: "html"');
    });

    it('should return true when request is required', () => {
      const result = isRequestRequired('/api/v1/name', 'post');
      expect(result).toBeTruthy();
    });

    it('should return false when request is not required', () => {
      const result = isRequestRequired('/api/v1/albums', 'post');
      expect(result).toBeFalsy();
    });

    it('should return false when request is not documented', () => {
      const result = isRequestRequired('/api/v1/name', 'patch');
      expect(result).toBeFalsy();
    });

    it('should always return false when we validate a get method', () => {
      const result = isRequestRequired('/api/v1/albums', 'get');
      expect(result).toBeFalsy();
    });
  });
});

describe('isRequestRequired method with custom Handler', () => {
  const customErrorCallback = jest.fn();
  const { isRequestRequired } = validator(mock, {
    errorHandler: customErrorCallback,
  });
  describe('validate OpenAPI endpoint', () => {
    it('should throw errors when basic type is not valid', () => {
      try {
        isRequestRequired('/api/v1/non-valid-endpoint', 'post');
      } catch (err) {
        expect(customErrorCallback).toHaveBeenCalledWith(
          'Endpoint: "/api/v1/non-valid-endpoint" not found in the OpenAPI definition',
          undefined,
        );
      }
    });

    it('should throw errors when reference type is not valid', () => {
      try {
        isRequestRequired('/api/v1/name', 'post', 'html');
      } catch (err) {
        expect(customErrorCallback).toHaveBeenCalledWith(
          'Method: "post" and Endpoint: "/api/v1/name" does not have requestBody with this ContentType: "html"',
          undefined,
        );
      }
    });

    it('should throw errors when reference type is not valid as an empty array', () => {
      try {
        isRequestRequired('/api/v1/name', 'post', 'html');
      } catch (err) {
        expect(customErrorCallback).toHaveBeenCalledWith(
          'Method: "post" and Endpoint: "/api/v1/name" does not have requestBody with this ContentType: "html"',
          undefined,
        );
      }
    });
  });
});
