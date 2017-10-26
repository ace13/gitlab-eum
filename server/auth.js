var router = require('express-promise-router')();

var config = require('../config');

router.get('/', (req, res) => {
  console.log('GET: /auth');

  res.send(
  {
    id: 1,
    username: 'aleol57',
    name: 'Alexander Olofsson',
    avatar_url: 'https://secure.gravatar.com/avatar/548cb50eada3c490bbc800cc37843e85?s=80&d=identicon'
  });
});

router.get('/signout', (req, res) => {
  console.log('GET: /auth/signout');

  res.redirect(config.gitlab.url);
});

module.exports = router;
