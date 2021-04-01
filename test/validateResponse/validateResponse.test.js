const validator = require('../..');
const mock = require('./mock.json');

/**
 * All the endpoints we are using, you can find them in the fake-server.js file
 * And the OpenAPI JSON in the mock.json
 */
describe('validateResponse method', () => {
  const { validateResponse } = validator(mock);
  describe('validate method args', () => {
    it('validate when "value" is not send', () => {
      expect(() => {
        validateResponse();
      }).toThrow('Value: "undefined" is required');
    });

    it('validate when "endpoint" is not send', () => {
      expect(() => {
        validateResponse('value');
      }).toThrow('Endpoint: "undefined" is required');
    });

    it('validate when "method" is not send', () => {
      expect(() => {
        validateResponse('value', 'endpoint');
      }).toThrow('Method: "undefined" is not valid');
    });

    it('validate when "status" is not send', () => {
      expect(() => {
        validateResponse('value', 'endpoint', 'get');
      }).toThrow('Status: "undefined" is not valid');
    });
  });

  describe('validate OpenAPI endpoint', () => {
    it('should throw errors when endpoint does not exist', () => {
      expect(() => {
        validateResponse(false, '/api/v1/non-valid-endpoint', 'post', 200);
      }).toThrow('Endpoint: "/api/v1/non-valid-endpoint" not found in the OpenAPI definition');
    });

    it('should throw errors when endpoint\'s method does not exist', () => {
      expect(() => {
        validateResponse(false, '/api/v2/album', 'put', 200);
      }).toThrow('Method: "put" not found in the OpenAPI definition for "/api/v2/album" endpoint');
    });

    it('should throw errors when endpoint\'s status does not exist', () => {
      expect(() => {
        validateResponse(false, '/api/v2/album', 'get', 500);
      }).toThrow('Status: "500" not found in the OpenAPI definition for Method: "get" and Endpoint: "/api/v2/album"');
    });

    it('should throw errors when endpoint\'s content-type does not exist', () => {
      expect(() => {
        validateResponse(false, '/api/v2/album', 'get', 200, 'html');
      }).toThrow('Method: "get" and Endpoint: "/api/v2/album" does not have responses with this ContentType: "html"');
    });

    it('should validate basic object type', () => {
      const result = validateResponse({ test: 'valid object' }, '/api/v2/album', 'get', 200);
      expect(result).toBeTruthy();
    });

    it('should validate object type with reference', () => {
      const result = validateResponse([{
        artist: 'Test artist',
        title: 'Album 1',
        year: [2020],
      }], '/api/v1/albums', 'get', 200);
      expect(result).toBeTruthy();
    });

    it('should throw errors when basic type is not valid', () => {
      expect(() => {
        validateResponse(false, '/api/v1/album', 'get', 200);
      }).toThrow('Error in response: should be string. You provide "false"');
    });

    it('should throw errors when reference type is not valid', () => {
      expect(() => {
        validateResponse(false, '/api/v1/albums', 'get', 200);
      }).toThrow('Error in response: should be array. You provide "false"');
    });

    it('should throw errors when reference type is not valid as an empty array', () => {
      expect(() => {
        validateResponse([{ invalidKey: 'nonValid' }], '/api/v1/albums', 'get', 200);
      }).toThrow('Error in response: should have required property \'title\'. You provide "[{"invalidKey":"nonValid"}]"');
    });
  });
});

describe('validateResponse method with custom Handler', () => {
  const customErrorCallback = jest.fn();
  const { validateResponse } = validator(mock, {
    errorHandler: customErrorCallback,
  });
  describe('validate OpenAPI endpoint', () => {
    it('should throw errors when basic type is not valid', () => {
      try {
        validateResponse(false, '/api/v1/album', 'get', 200);
      } catch (err) {
        expect(customErrorCallback).toHaveBeenCalledWith(
          'Error in response: should be string. You provide "false"',
          [{
            dataPath: '', keyword: 'type', message: 'should be string', params: { type: 'string' }, schemaPath: '#/type',
          }],
        );
      }
    });

    it('should throw errors when reference type is not valid', () => {
      try {
        validateResponse(false, '/api/v1/albums', 'get', 200);
      } catch (err) {
        expect(customErrorCallback).toHaveBeenCalledWith(
          'Error in response: should be array. You provide "false"',
          [{
            dataPath: '', keyword: 'type', message: 'should be array', params: { type: 'array' }, schemaPath: '#/type',
          }],
        );
      }
    });

    it('should throw errors when reference type is not valid as an empty array', () => {
      try {
        validateResponse([{ invalidKey: 'nonValid' }], '/api/v1/albums', 'get', 200);
      } catch (err) {
        expect(customErrorCallback).toHaveBeenCalledWith(
          'Error in response: should have required property \'title\'. You provide "[{"invalidKey":"nonValid"}]"',
          [{
            dataPath: '/0', keyword: 'required', message: "should have required property 'title'", params: { missingProperty: 'title' }, schemaPath: 'defs.json#/definitions/components/schemas/Song/required',
          }],
        );
      }
    });
  });
});
