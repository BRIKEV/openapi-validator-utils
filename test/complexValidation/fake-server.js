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
 * POST /api/v1/song
 * @param {string} id.form.required - This is the song id - application/x-www-form-urlencoded
 * @param {string} title.form.required - This is the song title - application/x-www-form-urlencoded
 * @return {object} 200 - song response
 */
app.post('/api/v1/songs', (req, res) => res.json({}));

/**
 * A song
 * @typedef {object} Song
 * @property {string} title.required - The title
 * @property {string} artist - The artist
 * @property {string} cover - image cover - binary
 * @property {integer} year - The year - int64
 */

/**
 * POST /api/v1/album
 * @param {Song} request.body.required - songs info - multipart/form-data
 * @return {object} 200 - Album created
 */
app.post('/api/v1/album', (req, res) => res.send('You save a song!'));

/**
 * @typedef {object} IntrumentalSong
 * @property {string} title.required - The title
 * @property {string} band - The band
 * @property {number} year - The year
 */

/**
 * @typedef {object} PopSong
 * @property {string} title.required - The title
 * @property {string} artist - The artist
 * @property {integer} year - The year
 */

/**
 * GET /api/v1/song/{id}
 * @summary This is the summary or description of the endpoint
 * @tags album
 * @param {number} id.path - song id
 * @return {oneOf|IntrumentalSong|PopSong} 200 - success response - application/json
 */
app.get('/api/v1/song/:id', (req, res) => (
  res.json({
    title: 'abum 1',
  })
));
