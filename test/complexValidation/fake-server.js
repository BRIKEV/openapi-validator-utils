const express = require('express');
const fs = require('fs');
const expressJSDocSwagger = require('express-jsdoc-swagger');

const extraMock = require('./extraMock.json');

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
const instance = expressJSDocSwagger(app)(options, extraMock);

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
 * @property {number} year - The year - double
 */

/**
 * POST /api/v1/album
 * @param {Song} request.body.required - songs info - multipart/form-data
 * @return {object} 200 - Album created
 */
app.post('/api/v1/album', (req, res) => res.send('You save a song!'));

/**
 * A song response
 * @typedef {object} SongResponse
 * @property {string} title.required - The title
 * @property {string} release - The year - date
 */

/**
 * GET /api/v1/songs/{id}
 * @return {SongResponse} 200 - Album created
 */
app.get('/api/v1/songs/:id', (req, res) => res.json({ title: 'example', release: new Date() }));

/**
 * GET /api/v1/date
 * @param {string} id.query - song id
 * @param {string} email.query - song email
 * @param {string} dateTime.query - song date type
 * @return {object} 200 - date description
 */
app.get('/api/v1/date', (req, res) => res.send('invalidDate'));

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

/**
 * Test schema
 * @typedef {object} CustomError
 * @property {string} message
 */

/**
 * Test schema
 * @typedef {object} TestSchema
 * @property {string|number|CustomError} value.required - Property with multiple type support
 */

/**
 * GET /api/v1/internal/reference
 * @summary This is the summary or description of the endpoint
 * @tags album
 * @return {TestSchema|PopSong} 200 - success response - application/json
 */
app.get('/api/v1/internal/reference', (req, res) => (
  res.json({
    title: 'abum 1',
  })
));

/**
 * Object schema
 * @typedef {object} ObjectReference
 * @property {string} message
 */

/**
 * Object schema
 * @typedef {object} ObjectReferenceResponse
 * @property {string} title
 * @property {ObjectReference|null} objectReference
 */

/**
 * GET /api/v1/object/reference
 * @summary This is the summary or description of the endpoint
 * @tags album
 * @return {ObjectReferenceResponse|boolean} 200 - success response - application/json
 */
app.get('/api/v1/object/reference', (req, res) => (
  res.json({
    title: 'abum 1',
  })
));

/**
 * GET /api/v1/object/multiple/null-reference
 * @summary This is the summary or description of the endpoint
 * @tags album
 * @return {ObjectReferenceResponse|boolean|null} 200 - success response - application/json
 */
app.get('/api/v1/object/multiple/null-reference', (req, res) => (
  res.json({
    title: 'abum 1',
  })
));
