const express = require('express');
const fs = require('fs');
const expressJSDocSwagger = require('express-jsdoc-swagger');

const options = {
  info: {
    version: '1.0.0',
    title: 'Albums store',
    license: {
      name: 'MIT',
    },
  },
  filesPattern: './fake-server.js',
  baseDir: __dirname,
};

const app = express();
const instance = expressJSDocSwagger(app)(options);

instance.on('finish', data => {
  const dataStringified = JSON.stringify(data, null, 2);
  fs.writeFile('mock.json', dataStringified, err => {
    // eslint-disable-next-line
    if (err) return console.error(`Error generating mocks ${err}`);
    // eslint-disable-next-line
    return console.log('Save mock');
  });
});

/**
 * GET /api/v1
 * @summary This is the summary or description of the endpoint
 * @param {string} name.query.required - name param description - enum:type1,type2
 * @return {string} 200 - success response
 */
app.get('/api/v1', (req, res) => res.send('Hello World!'));

/**
 * GET /api/v1/albums
 * @summary This is the summary or description of the endpoint
 * @param {string} name.query.required - name param description - enum:type1,type2
 * @param {string} license.query - enum:MIT,ISC - name param description
 * @return {object} 200 - success response - application/json
 */
app.get('/api/v1/albums', (req, res) => (
  res.json([{
    title: 'abum 1',
  }])
));

/**
 * GET /api/v1/albums/{id}
 * @summary This is the summary or description of the endpoint
 * @param {array<string>} name.query.required.deprecated - name param description
 * @param {number} id.path
 * @return {object} 200 - success response - application/json
 */
app.get('/api/v1/albums/:id', (req, res) => (
  res.json([{
    title: 'abum 1',
  }])
));
