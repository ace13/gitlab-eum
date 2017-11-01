'use strict';

const config = require('../config');
const axios  = require('axios').create({
  baseURL: config.gitlab.url,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'GitLab-EUM/1.0',
    'Private-Token': config.gitlab.token
  }
});
const router   = require('express-promise-router')();
const { Pool } = require('pg');

const db = new Pool();

// TODO: Figure out the perfect db layout
const seed = `
CREATE TABLE IF NOT EXISTS external_users (
  id INTEGER PRIMARY KEY,
  owner_id INTEGER NOT NULL,
  username VARCHAR(256) NOT NULL,
  date_added TIMESTAMP DEFAULT NOW()
);
`;

router.get('/', async (req, res) => {
  console.log('GET: /users');

  const { rows } = await db.query('SELECT * FROM external_users WHERE owner_id = $1', req.user.id);

  res.send(rows.map((row) => row.id));
});

router.post('/', (req, res) => {
  console.log("POST: /users");
  console.log(req.body);
  req.body = Object.keys(req.body)
    .filter( key => !['admin', 'skip_confirmation'].includes(key) )
    .reduce( (rs, key) => (rs[key] = req.body[key], rs), {} );

  // TODO: Apply further validation on input
  // XXX   Make sure user is allowed to create

  return axios.post('api/v4/users', req.body)
    .then((response) => {
      console.log("> Response:");
      console.log(response.data);
      res.send(response.data);
    }, (err) => {
      console.log("> Error:");
      console.log(err.response.data);
      res.status(err.response.status).send(err.response.data);
    });
});

router.get('/:userId', (req, res) => {
  console.log('GET: /users/' + req.params.userId);

  return axios.get('api/v4/users/' + req.params.userId)
    .then((response) => {
      console.log("> Response:");
      console.log(response.data);
      res.send(response.data);
    }, (err) => {
      console.log("> Error:");
      console.log(err.response.data);
      res.status(err.response.status).send(err.response.data);
    });
});

module.exports = router;
