'use strict';

const config = require('../config');

const db     = require('db');
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

  const { rows } = await db.query('SELECT * FROM external_users WHERE owner_id = $1', req.user.id);

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
    const response = await axios.post('api/v4/users', req.body)
    const data = response.data
    console.log("> Response:");
    console.log(data);

    try {
      const queryText = 'INSERT INTO external_users(id, owner_id, username, date_added) VALUES($1, $2, $3, NOW())';
      await db.query(queryText, [data.id, req.user.id, data.username]);
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
