const validator = require('../..');
const mock = require('./mock.json');

/**
 * All the endpoints we are using, you can find them in the fake-server.js file
 * And the OpenAPI JSON in the mock.json
 */
describe('Validate onOf with discriminator in request and response object', () => {
  const { validateRequest, validateResponse } = validator(mock);
  describe('Instrumental Songs', () => {
    it('should validate request object type with oneOf and discriminator', () => {
      const result = validateRequest({
        title: 'Instrumental Song',
        year: 1999,
        additional: {
          type: 'INSTRUMENTAL',
          band: 'The band',
        },
      }, '/api/v1/songs', 'post');
      expect(result).toBeTruthy();
    });
    it('should validate response object type with oneOf and discriminator', () => {
      const result = validateResponse({
        title: 'Instrumental Song',
        year: 1999,
        additional: {
          type: 'INSTRUMENTAL',
          band: 'The band',
        },
      }, '/api/v1/songs', 'post', 200, 'application/json');
      expect(result).toBeTruthy();
    });
  });
  describe('Pop Songs', () => {
    it('should validate request object type with oneOf and discriminator for pop song', () => {
      const result = validateRequest({
        title: 'Instrumental Song',
        year: 1999,
        additional: {
          type: 'POP',
          artist: 'The artist',
        },
      }, '/api/v1/songs', 'post');
      expect(result).toBeTruthy();
    });

    it('validate pop response', () => {
      const result = validateResponse({
        title: 'Instrumental Song',
        year: 1999,
        additional: {
          type: 'POP',
          artist: 'The artist',
        },
      }, '/api/v1/songs', 'post', 200, 'application/json');
      expect(result).toBeTruthy();
    });
  });
  describe('Bad requests', () => {
    it('should not validate 1', () => {
      expect(() => {
        validateRequest({
          title: 'Instrumental Song',
          year: 1999,
          additional: {
            type: 'INSTRUMENTAL',
            artist: 'The artist',
          },
        }, '/api/v1/songs', 'post');
      }).toThrow('Error in request: Schema InstrumentalSong must have required property \'band\'. You provide "{"title":"Instrumental Song","year":1999,"additional":{"type":"INSTRUMENTAL","artist":"The artist"}}"');
    });

    it('should not validate 2', () => {
      expect(() => {
        validateRequest({
          title: 'Instrumental Song',
          year: 1999,
          additional: {
            type: 'POP',
            band: 'The band',
          },
        }, '/api/v1/songs', 'post');
      }).toThrow('Error in request: Schema PopSong must have required property \'artist\'. You provide "{"title":"Instrumental Song","year":1999,"additional":{"type":"POP","band":"The band"}}"');
    });

    it('should not validate 3', () => {
      expect(() => {
        validateResponse({
          title: 'Instrumental Song',
          year: 1999,
          additional: {
            type: 'INSTRUMENTAL',
            artist: 'The artist',
          },
        }, '/api/v1/songs', 'post', 200, 'application/json');
      }).toThrow('Error in response: Schema InstrumentalSong must have required property \'band\'. You provide "{"title":"Instrumental Song","year":1999,"additional":{"type":"INSTRUMENTAL","artist":"The artist"}}"');
    });

    it('should not validate 4', () => {
      expect(() => {
        validateResponse({
          title: 'Instrumental Song',
          year: 1999,
          additional: {
            type: 'POP',
            band: 'The band',
          },
        }, '/api/v1/songs', 'post', 200, 'application/json');
      }).toThrow('Error in response: Schema PopSong must have required property \'artist\'. You provide "{"title":"Instrumental Song","year":1999,"additional":{"type":"POP","band":"The band"}}"');
    });
  });
});

describe('Validate onOf with discriminator in path definition', () => {
  const { validateRequest, validateResponse } = validator(mock);
  describe('Instrumental Songs', () => {
    it('should validate request object type with oneOf and discriminator', () => {
      const result = validateRequest({
        type: 'INSTRUMENTAL',
        band: 'The band',
      }, '/api/v1/song-types', 'post');
      expect(result).toBeTruthy();
    });
    it('should validate response object type with oneOf and discriminator', () => {
      const result = validateResponse({
        type: 'INSTRUMENTAL',
        band: 'The band',
      }, '/api/v1/song-types', 'post', 200, 'application/json');
      expect(result).toBeTruthy();
    });
  });
  describe('Pop  song-types', () => {
    it('should validate request object type with oneOf and discriminator for pop song', () => {
      const result = validateRequest({
        type: 'POP',
        artist: 'The artist',
      }, '/api/v1/song-types', 'post');
      expect(result).toBeTruthy();
    });

    it('validate pop response', () => {
      const result = validateResponse({
        type: 'POP',
        artist: 'The artist',
      }, '/api/v1/song-types', 'post', 200, 'application/json');
      expect(result).toBeTruthy();
    });
  });
  describe('Bad requests', () => {
    it('should not validate 1', () => {
      expect(() => {
        validateRequest({
          type: 'INSTRUMENTAL',
          artist: 'The artist',
        }, '/api/v1/song-types', 'post');
      }).toThrow('Error in request: Schema InstrumentalSong must have required property \'band\'. You provide "{"type":"INSTRUMENTAL","artist":"The artist"}"');
    });

    it('should not validate 2', () => {
      expect(() => {
        validateRequest({
          type: 'POP',
          band: 'The band',
        }, '/api/v1/song-types', 'post');
      }).toThrow('Error in request: Schema PopSong must have required property \'artist\'. You provide "{"type":"POP","band":"The band"}"');
    });

    it('should not validate 3', () => {
      expect(() => {
        validateResponse({
          type: 'INSTRUMENTAL',
          artist: 'The artist',
        }, '/api/v1/song-types', 'post', 200, 'application/json');
      }).toThrow('Error in response: Schema InstrumentalSong must have required property \'band\'. You provide "{"type":"INSTRUMENTAL","artist":"The artist"}"');
    });

    it('should not validate 4', () => {
      expect(() => {
        validateResponse({
          type: 'POP',
          band: 'The band',
        }, '/api/v1/song-types', 'post', 200, 'application/json');
      }).toThrow('Error in response: Schema PopSong must have required property \'artist\'. You provide "{"type":"POP","band":"The band"}"');
    });
  });
});
