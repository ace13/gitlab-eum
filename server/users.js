var axios  = require('axios');
var router = require('express-promise-router')();

const gitlabUrl = 'https://gitlab.liu.se'

axios = axios.create({
  baseURL: gitlabUrl,
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0'
  }
});

router.get('/', (req, res) => {
  console.log('GET: /users');

  res.send([1,2,3,4]);
});

router.post('/', (req, res) => {
  console.log("POST: /users");
  console.log(req.body);
  req.body = Object.keys(req.body)
    .filter( key => !['admin', 'skip_confirmation'].includes(key) )
    .reduce( (rs, key) => (rs[key] = req.body[key], rs), {} );

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
