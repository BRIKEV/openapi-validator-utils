export = responseBuilder;
/** @module Utils/responseBuilder */
/**
 * Builder return validation
 * @typedef {object} BuilderResponse
 * @property {boolean} valid
 * @property {string} errorMessage
 */
/**
 * This methods creates a common payload for the "validators"
 * @param {boolean} valid
 * @param {string} errorMessage
 * @returns {BuilderResponse}
 */
declare function responseBuilder(valid: boolean, errorMessage?: string): BuilderResponse;
declare namespace responseBuilder {
    export { BuilderResponse };
}
/**
 * Builder return validation
 */
type BuilderResponse = {
    valid: boolean;
    errorMessage: string;
};
