/** @module Utils */

/**
 * formatSchemaMessage
 * @param {string} message schema path message
 * @example
 *  defs.json#/definitions/components/schemas/Song/required
 */
const formatSchemaMessage = message => {
  const [, schema] = message.split('/schemas/');
  const errorType = message.match(/[^/]+(?=$|$)/);
  const schemaFormatted = schema.replace(`/${errorType}`, '');
  const schemaMessage = ` and Schema ${schemaFormatted}`;
  return schemaMessage;
};

module.exports = formatSchemaMessage;
