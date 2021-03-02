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

test('should throw error when we send options with null value', () => {
  expect(() => {
    validator({
      openapi: '3.0.0',
      info: {
        description: 'This is a sample server Petstore server.',
      },
    }, null);
  }).toThrow('Options is not a valid JSON');
});

test('should throw error when we send extra option', () => {
  expect(() => {
    validator({
      openapi: '3.0.0',
      info: {
        description: 'This is a sample server Petstore server.',
      },
    }, { extraOption: {} });
  }).toThrow('Only this props are valid: ajvConfig, errorHandler');
});

test('should throw error when errorHandler is not a function', () => {
  expect(() => {
    validator({
      openapi: '3.0.0',
      info: {
        description: 'This is a sample server Petstore server.',
      },
    }, { errorHandler: 'nonValid' });
  }).toThrow('errorHandler option must be a function');
});
