'use strict';

var axios  = require('axios');
var router = require('express-promise-router')();

var config = require('../config');

axios = axios.create({
  baseURL: config.gitlab.url,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'GitLab-EUM/1.0',
    'Private-Token': config.gitlab.token
  }
});

router.get('/', (req, res) => {
  console.log('GET: /users');

  // TODO: Grab from a database
  res.send([1,2,3,4]);
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
