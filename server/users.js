'use strict';

const config = require('../config');

const db     = require('./db');
const router = require('express-promise-router')();
const axios  = require('axios').create({
  baseURL: config.gitlab.url,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'GitLab-EUM/1.0',
    'Private-Token': config.gitlab.token
  }
});

router.get('/audit', async (req, res) => {
  console.log('GET: /users/audit');

  try {
    const queryText = 'SELECT * FROM audit_events WHERE user_id = $1';
    console.log('> DB Query:');
    console.log(queryText);
    const dbResponse = await db.query(queryText, [req.user.id]);
    console.log('> DB Response:');
    console.log(dbResponse);
    var rows = dbResponse.rows;

    res.send(rows);
  } catch(err) {
    console.log("> DB Error:");
    console.log(err);
    return res.status(500).send({ 'message': "Database error occured" });
  }
});

router.get('/', async (req, res) => {
  console.log('GET: /users');

  try {
    const queryText = 'SELECT * FROM external_users WHERE owner_id = $1';
    console.log('> DB Query:');
    console.log(queryText);
    const dbResponse = await db.query(queryText, [req.user.id]);
    console.log('> DB Response:');
    console.log(dbResponse);
    var rows = dbResponse.rows;

    res.send(rows.map((row) => row.user_id));
  } catch(err) {
    console.log("> DB Error:");
    console.log(err);
    return res.status(500).send({ 'message': "Database error occured" });
  }
});

router.post('/', async (req, res) => {
  console.log("POST: /users");
  console.log(req.body);
  req.body = Object.keys(req.body)
    .filter( key => ['email','username','name','skype','linkedin','twitter','website_url','organization','bio','location','avatar'].includes(key) )
    .reduce( (rs, key) => (rs[key] = req.body[key], rs), {} );

  try {
    const queryText = 'SELECT * FROM external_users WHERE owner_id = $1';
    console.log('> DB Query:');
    console.log(queryText);
    const dbResponse = await db.query(queryText, [req.user.id]);
    console.log('> DB Response:');
    console.log(dbResponse);

    if (dbResponse.rowCount >= config.external_limit) {
      return res.status(400).send({ 'message': 'External user limit reached' });
    }
  } catch(err) {
    console.log("> DB Error:");
    console.log(err);
    return res.status(500).send({ 'message': "Database error occured" });
  }
  // TODO: Apply further validation on input
  // XXX   Make sure user is allowed to create

  try {
    var dbResponse = null;

    console.log('> REST Query:');
    console.log('POST api/v4/users');
    const response = await axios.post('api/v4/users', Object.assign({}, req.body, { external: true, reset_password: true }))
    const data = response.data
    console.log('> Response:');
    console.log(data);

    try {
      const queryText = 'INSERT INTO external_users(owner_id, user_id, username) VALUES($1, $2, $3)';
      console.log('> DB Query:');
      console.log(queryText);
      dbResponse = await db.query(queryText, [req.user.id, data.id, req.body.username]);
      console.log('> DB Response:');
      console.log(dbResponse);
    } catch(err) {
      console.log('> DB Error:');
      console.log(err);

      return res.status(500).send({ 'message': 'Database error occured' });
    }

    try {
      const queryText = 'INSERT INTO audit_events(event, user_id, message) VALUES($1, $2, $3)';
      console.log('> DB Query:');
      console.log(queryText);
      const auditresp = await db.query(queryText, ['user.create', req.user.id, `Created account: ${data.name} <${data.email}>, username: ${data.username}`]);
      console.log('> DB Response:');
      console.log(auditresp);
    } catch(err) {
      console.log('> DB Error:');
      console.log(err);
    }

    res.send(data);
  } catch(err) {
    console.log('> Error:');
    console.log(err.response.data);
    res.status(err.response.status).send(err.response.data);
  }
});

router.get('/:userId', async (req, res) => {
  console.log('GET: /users/' + req.params.userId);

  try {
    console.log('> REST Query:');
    console.log('GET api/v4/users/' + req.params.userId);
    const response = await axios.get('api/v4/users/' + req.params.userId)
    const data = response.data
    console.log('> Response:');
    console.log(data);

    res.send(data);
  } catch(err) {
    console.log('> Error:');
    console.log(err.response.data);
    res.status(err.response.status).send(err.response.data);
  }
});

module.exports = router;
