const validator = require('..');

test('should throw error when we don\'t send OpenAPI configuration', () => {
  expect(() => {
    validator();
  }).toThrow('Input is not a valid JSON');
});

test('should throw error when we send empty OpenAPI JSON', () => {
  expect(() => {
    validator({});
  }).toThrow('Please provide a valid OpenAPI docs');
});

test('should throw error when we send an old OpenAPI spec', () => {
  expect(() => {
    validator({
      swagger: '2.0',
      info: {
        description: 'This is a sample server Petstore server.',
      },
    });
  }).toThrow('OpenAPI definition must be 3.x version');
});
