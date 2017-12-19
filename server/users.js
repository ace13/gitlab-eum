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
    const queryText = 'SELECT * FROM external_users WHERE owner_id = $1';
    const dbResponse = await db.query(queryText, [req.user.id]);
    const rows = dbResponse.rows;

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

  req.body = Object.assign({},
    config.creation_default,
    Object.keys(req.body)
    .filter( key => ['email','username','name','skype','linkedin','twitter','website_url','organization','bio','location','avatar'].includes(key) )
    .reduce( (rs, key) => (rs[key] = req.body[key], rs), {} )
  )

  if (req.user.eum_settings.external_limit == 0) {
      return res.status(401).send({ 'message': 'No external users allowed' });
  }

  if (req.user.eum_settings.external_limit > 0) {
    try {
      const queryText = 'SELECT * FROM external_users WHERE owner_id = $1';
      const dbResponse = await db.query(queryText, [req.user.id]);

      if (dbResponse.rowCount >= req.user.eum_settings.external_limit) {
        return res.status(403).send({ 'message': 'External user limit reached' });
      }
    } catch(err) {
      console.log("> DB Error:");
      console.log(err);
      return res.status(500).send({ 'message': "Database error occured" });
    }
  }

  if (req.body.email.match(/@(.*\.)?liu\.se$/)) {
    return res.status(400).send({ 'message': 'LiU users should use their LiU-ID to sign in here' })
  }

  // TODO: Apply further validation on input
  // XXX   Make sure user is allowed to create

  try {
    var dbResponse = null;

    const response = await axios.post('api/v4/users', Object.assign({}, req.body, { external: true, reset_password: true }))
    const data = response.data

    try {
      const queryText = 'INSERT INTO external_users(owner_id, user_id, username) VALUES($1, $2, $3)';
      const dbResponse = await db.query(queryText, [req.user.id, data.id, req.body.username]);
    } catch(err) {
      console.log('> DB Error:');
      console.log(err);

      return res.status(500).send({ 'message': 'Database error occured' });
    }

    try {
      const queryText = 'INSERT INTO audit_events(event, user_id, message) VALUES($1, $2, $3)';
      const auditresp = await db.query(queryText, ['user.create', req.user.id, `Created account: ${data.name} <${data.email}>, username: ${data.username}`]);
    } catch(err) {
      console.log('> DB Error on audit:');
      console.log(err);
    }

    res.status(201).send(data);
  } catch(err) {
    console.log('> Error:');
    console.log(err.response.data);
    res.status(err.response.status).send(err.response.data);
  }
});

router.get('/:userId', async (req, res) => {
  console.log('GET: /users/' + req.params.userId);

  if (!req.user.is_admin) {
    try {
      const queryText = 'SELECT * FROM external_users WHERE owner_id = $1';
      const dbResponse = await db.query(queryText, [req.user.id]);

      if (!dbResponse.rows.find((uid) => uid.user_id == req.params.userId)) {
        console.log(`External user ${req.params.userId} not related to ${req.user.username}.`);
        return res.status(403).send({ 'message': 'Requested User ID is not related to the authenticated account.' });
      }
    } catch(err) {
      console.log("> DB Error:");
      console.log(err);
      return res.status(500).send({ 'message': "Database error occured" });
    }
  }

  try {
    const response = await axios.get('api/v4/users/' + req.params.userId)
    const data = response.data

    res.send(data);
  } catch(err) {
    console.log('> Error:');
    console.log(err.response.data);
    res.status(err.response.status).send(err.response.data);
  }
});

router.get('/audit', async (req, res) => {
  console.log('GET: /users/audit');

  try {
    const queryText = 'SELECT * FROM audit_events WHERE user_id = $1';
    const dbResponse = await db.query(queryText, [req.user.id]);
    const rows = dbResponse.rows;

    res.send(rows);
  } catch(err) {
    console.log("> DB Error:");
    console.log(err);
    return res.status(500).send({ 'message': "Database error occured" });
  }
});


module.exports = router;
