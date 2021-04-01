const responseBuilder = (valid, errorMessage = '') => ({
  valid,
  errorMessage,
});

module.exports = responseBuilder;
