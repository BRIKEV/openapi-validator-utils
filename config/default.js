module.exports = {
  // Options to override default ajv settings (https://ajv.js.org/options.html)
  ajvConfig: {},

  // Custom error handler
  errorHandler: null,

  // If enabled, validation will throw errors if the payload has additional
  // properties not defined in the schema
  strictValidation: true,
};
