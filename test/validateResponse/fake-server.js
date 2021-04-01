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
 * A song type
 * @typedef {object} Song
 * @property {string} title.required - The title
 * @property {string} artist - The artist
 * @property {array<number>} year
 */

/**
 * GET /api/v2/album
 * @summary This is the summary or description of the endpoint
 * @tags album
 * @security BasicAuth
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
app.get('/api/v2/album', (req, res) => (
  res.json({
    title: 'abum 1',
  })
));

/**
 * GET /api/v1/album
 * @summary This is the summary or description of the endpoint
 * @tags album
 * @deprecated
 * @return {string} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
app.get('/api/v1/album', (req, res) => (
  res.json({
    title: 'abum 1',
  })
));

/**
 * GET /api/v1/albums
 * @summary This is the summary or description of the endpoint
 * @tags album
 * @return {array<Song>} 200 - success response - application/json
 */
app.get('/api/v1/albums', (req, res) => (
  res.json([{
    title: 'abum 1',
  }])
));
