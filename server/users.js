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

router.get('/', async (req, res) => {
  console.log('GET: /users');

  try {
    const { rows } = await db.query('SELECT * FROM external_users WHERE owner_id = $1', req.user.id);
  } catch(err) {
    console.log("> DB Error:");
    console.log(err);
    return res.status(500).send({ 'message': "Database error occured" });
  }

  res.send(rows.map((row) => row.id));
});

router.post('/', async (req, res) => {
  console.log("POST: /users");
  console.log(req.body);
  req.body = Object.keys(req.body)
    .filter( key => !['admin', 'skip_confirmation'].includes(key) )
    .reduce( (rs, key) => (rs[key] = req.body[key], rs), {} );

  // TODO: Apply further validation on input
  // XXX   Make sure user is allowed to create

  try {
    var dbResponse = null;

    try {
      const queryText = 'INSERT INTO external_users(owner_id, username, date_added) VALUES($1, $2, NOW())';
      console.log("> DB Query:");
      console.log(queryText);
      dbResponse = await db.query(queryText, [req.user.id, req.body.username]);
      console.log("> DB Response:");
      console.log(dbResponse);
    } catch(err) {
      console.log("> DB Error:");
      console.log(err);

      return res.status(500).send({ 'message': "Database error occured" });
    }

    const response = await axios.post('api/v4/users', req.body)
    const data = response.data
    console.log("> Response:");
    console.log(data);

    try {
      const queryText = 'INSERT INTO audit_events(event, user_id, message) VALUES($1, $2, $3)';
      console.log("> DB Query:");
      console.log(queryText);
      const auditresp = await db.query(queryText, ['user.create', req.user.id, `Created account: ${dbResponse.body.name}  <${dbResponse.body.email}>, username: ${dbResponse.body.username}`]);
      console.log("> DB Response:");
      console.log(auditresp);
    } catch(err) {
      console.log("> DB Error:");
      console.log(err);
    }

    try {
      const queryText = 'UPDATE external_users SET user_id = $2 WHERE id = $1';
      console.log("> DB Query:");
      console.log(queryText);
      dbResponse = await db.query(queryText, [dbResponse.id, data.id]);
      console.log("> DB Response:");
      console.log(dbResponse);
    } catch(err) {
      console.log("> DB Error:");
      console.log(err);

      return res.status(500).send({ 'message': "Database error occured" });
    }

    res.send(data);
  } catch(err) {
    console.log("> Error:");
    console.log(err.response.data);
    res.status(err.response.status).send(err.response.data);
  }
});

router.get('/:userId', async (req, res) => {
  console.log('GET: /users/' + req.params.userId);

  try {
    const response = await axios.get('api/v4/users/' + req.params.userId)
    const data = response.data
    console.log("> Response:");
    console.log(data);

    res.send(data);
  } catch(err) {
    console.log("> Error:");
    console.log(err.response.data);
    res.status(err.response.status).send(err.response.data);
  }
});

module.exports = router;
