/**
 * This method validates request info
 * @param {object} definition OpenApi definition
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {string} contentType Content api of the request we want to validate
 * @returns {BuilderResponse}
 */
export function request(definition: object, endpoint: string, method: string, contentType: string): any;
/**
 * This method validates params info
 * @param {object} definition OpenApi definition
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {string} key OpenApi key we want to validate
 * @param {string} type OpenApi type we want to validate
 * @returns {BuilderResponse}
 */
export function params(definition: object, endpoint: string, method: string, key: string, type: string): any;
/**
 * This method validates responses info
 * @param {object} definition OpenApi definition
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {string} status OpenApi status we want to validate
 * @param {string} contentType Content api of the request we want to validate
 * @returns {BuilderResponse}
 */
export function response(definition: object, endpoint: string, method: string, status: string, contentType: string): any;
/**
 * This method validates required params
 * @param {object[]} values Values we want to validate
 * @param {object} definition OpenApi definition
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @returns {BuilderResponse}
 */
export function requiredParams(values: object[], definition: object, endpoint: string, method: string): any;
