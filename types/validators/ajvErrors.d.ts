export = ajvErrors;
/**
 * Description of the function
 * @name ErrorHandler
 * @function
 * @param {string} message Error message
 * @param {object} extra Ajv or extra error info
 */
/**
 * This methods formats Ajv errors after validation
 * @param {object[]} ajvError Errors after validation
 * @param {(numeric|boolean|string)} value Any type value you try to validate
 * @param {string} type Type of validation, params, response or request
 * @param {ErrorHandler} handler function to extend default behavior
 */
declare function ajvErrors(ajvError: object[], value: (any | boolean | string), type: string, handler: any): void;
