const numberTypes = [
  'number',
  'integer',
];

const sanitizeValueSchema = (value, schema) => {
  if (numberTypes.includes(schema.type)) {
    return Number(value);
  }
  if (schema.type === 'boolean') {
    return schema.type === 'true';
  }
  return value;
};

module.exports = sanitizeValueSchema;
