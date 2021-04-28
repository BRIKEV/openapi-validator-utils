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
    it('should throw errors when endpoint does not exist', () => {
      expect(() => {
        validateRequest(false, '/api/v1/non-valid-endpoint', 'post');
      }).toThrow('Endpoint: "/api/v1/non-valid-endpoint" not found in the OpenAPI definition');
    });

    it('should throw errors when endpoint\'s method does not exist', () => {
      expect(() => {
        validateRequest(false, '/api/v1/name', 'get');
      }).toThrow('Method: "get" not found in the OpenAPI definition for "/api/v1/name" endpoint');
    });

    it('should throw errors when endpoint\'s content-type does not exist', () => {
      expect(() => {
        validateRequest(false, '/api/v1/name', 'post', 'html');
      }).toThrow('Method: "post" and Endpoint: "/api/v1/name" does not have requestBody with this ContentType: "html"');
    });

    it('should throw errors when endpoint\'s don\'t have requestBody definition', () => {
      expect(() => {
        validateRequest({}, '/api/v1/name', 'patch');
      }).toThrow('Method: "patch" and Endpoint: "/api/v1/name" does not have requestBody definition');
    });

    it('should validate basic string type', () => {
      const result = validateRequest('valid string', '/api/v1/name', 'post');
      expect(result).toBeTruthy();
    });

    it('should validate object type with reference', () => {
      const result = validateRequest({ title: 'request title' }, '/api/v1/songs', 'post');
      expect(result).toBeTruthy();
    });

    it('should validate object type with reference and nullable value', () => {
      const result = validateRequest({ title: null }, '/api/v1/songs', 'post');
      expect(result).toBeTruthy();
    });

    it('should throw errors when basic type is not valid', () => {
      expect(() => {
        validateRequest(false, '/api/v1/name', 'post');
      }).toThrow('Error in request: must be string. You provide "false"');
    });

    it('should throw errors when reference type is not valid', () => {
      expect(() => {
        validateRequest(false, '/api/v1/albums', 'post');
      }).toThrow('Error in request: must be array. You provide "false"');
    });

    it('should throw errors when internal reference type is not valid', () => {
      expect(() => {
        validateRequest({
          name: 'song name',
          songs: [{ invalidKey: 'test' }],
        }, '/api/v1/author/songs', 'post');
      }).toThrow('Error in request: Schema Song must have required property \'title\'. You provide "{"name":"song name","songs":[{"invalidKey":"test"}]}"');
    });

    it('should throw errors when we send extra property', () => {
      expect(() => {
        validateRequest({
          title: 'song title',
          artist: 'artist',
          year: 1993,
          extraInvalidProperty: 'non valid property',
        }, '/api/v1/songs', 'post');
      }).toThrow('Error in request: Schema Song must NOT have additional properties, invalid property extraInvalidProperty. You provide "{"title":"song title","artist":"artist","year":1993,"extraInvalidProperty":"non valid property"}"');
    });

    it('should throw errors when reference type is not valid as an empty array', () => {
      expect(() => {
        validateRequest([{ invalidKey: 'nonValid' }], '/api/v1/albums', 'post');
      }).toThrow('Error in request: Schema Song must have required property \'title\'. You provide "[{"invalidKey":"nonValid"}]"');
    });
  });
});

describe('ValidateRequest method with custom Handler', () => {
  const customErrorCallback = jest.fn();
  const { validateRequest } = validator(mock, {
    errorHandler: customErrorCallback,
  });
  describe('validate OpenAPI endpoint', () => {
    it('should throw errors when basic type is not valid', () => {
      try {
        validateRequest(false, '/api/v1/name', 'post');
      } catch (err) {
        expect(customErrorCallback).toHaveBeenCalledWith(
          'Error in request: must be string. You provide "false"',
          [{
            instancePath: '', keyword: 'type', message: 'must be string', params: { type: 'string' }, schemaPath: '#/type',
          }],
        );
      }
    });

    it('should throw errors when reference type is not valid', () => {
      try {
        validateRequest(false, '/api/v1/albums', 'post');
      } catch (err) {
        expect(customErrorCallback).toHaveBeenCalledWith(
          'Error in request: must be array. You provide "false"',
          [{
            instancePath: '', keyword: 'type', message: 'must be array', params: { type: 'array' }, schemaPath: '#/type',
          }],
        );
      }
    });

    it('should throw errors when reference type is not valid as an empty array', () => {
      try {
        validateRequest([{ invalidKey: 'nonValid' }], '/api/v1/albums', 'post');
      } catch (err) {
        expect(customErrorCallback).toHaveBeenCalledWith(
          'Error in request: Schema Song must have required property \'title\'. You provide "[{"invalidKey":"nonValid"}]"',
          [{
            instancePath: '/0', keyword: 'required', message: "must have required property 'title'", params: { missingProperty: 'title' }, schemaPath: 'defs.json#/definitions/components/schemas/Song/required',
          }],
        );
      }
    });
  });
});
