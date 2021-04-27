const numberTypes = [
  'number',
  'integer',
];

const booleanTypes = [
  'true',
  'false',
];

const sanitizeValueSchema = (value, schema) => {
  if (numberTypes.includes(schema.type) && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  if (schema.type === 'boolean' && booleanTypes.includes(value)) {
    return value === 'true';
  }
  return value;
};

module.exports = sanitizeValueSchema;
