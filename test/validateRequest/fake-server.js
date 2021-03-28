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
 * A song
 * @typedef {object} Song
 * @property {string} title.required - The title
 * @property {string} artist - The artist
 * @property {integer} year - The year
 */

/**
 * POST /api/v1/songs
 * @param {Song} request.body.required - song info
 * @return {object} 200 - song response
 */
app.post('/api/v1/songs', (req, res) => res.send('You save a song!'));

/**
 * POST /api/v1/albums
 * @param {array<Song>} request.body.required
 * @return {object} 200 - song response
 */
app.post('/api/v1/albums', (req, res) => res.send('Hello World!'));

/**
 * POST /api/v1/name
 * @param {string} request.body.required - name body description
 * @return {object} 200 - song response
 */
app.post('/api/v1/name', (req, res) => res.send('Hello World!'));
