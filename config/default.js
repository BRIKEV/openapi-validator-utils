module.exports = {
  // Options to override default ajv settings (https://ajv.js.org/options.html)
  ajvConfig: {
    // support OAS discriminator https://swagger.io/docs/specification/data-models/inheritance-and-polymorphism/
    discriminator: true,
    // allow example props from OAS
    keywords: ['example'],
  },

  // Custom error handler
  errorHandler: null,

  // If enabled, validation will throw errors if the payload has additional
  // properties not defined in the schema
  strictValidation: true,

  // currently, AJV doesn't support discriminator mappings as used in OAS https://swagger.io/docs/specification/data-models/inheritance-and-polymorphism/
  // if one of the next versions of AJV supports it, this option can be removed
  // Issue on AJV: https://github.com/ajv-validator/ajv/issues/2003
  discriminatorMappingSupported: false,
};
