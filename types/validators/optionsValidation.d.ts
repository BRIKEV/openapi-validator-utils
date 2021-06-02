export = optionsValidation;
/**
 * This method validates the extra options. We only allow "ajvConfig" and "errorHandler" as
 * options to export
 * @param {object} options
 * @returns {BuilderResponse}
 */
declare function optionsValidation(options?: object): any;
