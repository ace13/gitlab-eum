var router         = require('express-promise-router')();
var passport       = require('passport');
var GitLabStrategy = require('passport-gitlab2').Strategy;

var ensureLogin  = require('connect-ensure-login').ensureLoggedIn;
var ensureLogout = require('connect-ensure-login').ensureLoggedOut;

var config = require('../config');

// TODO: Database of some kind for user tokens
var _tokenStore = {};
var _strategy = new GitLabStrategy({
    clientID: config.gitlab.client_id,
    clientSecret: config.gitlab.client_secret,
    callbackURL: config.gitlab.client_callback,
    baseURL: config.gitlab.url
  }, (access, refresh, profile, cb) => {
    var user = Object.assign({}, profile, { _token: access, _refresh: refresh });
    cb(null, user);
  }
);

// refresh.use(_strategy);
passport.use(_strategy);
passport.serializeUser(function(user, cb) {
  _tokenStore[user.id] = user;
  cb(null, user.id);
});
passport.deserializeUser(function(id, cb) {
  var user = _tokenStore[id];
  if (user) {
    cb(null, user);
  } else {
    cb(null, false);
  }
});

router.get('/', (req, res) => {
  console.log('GET: /auth');

  if (req.user) {
    res.send(req.user._json);
  } else {
    res.status(401).send({ message: 'Not authenticated' });
  }
});

router.get('/signin', passport.authenticate('gitlab'));
router.get('/signin/callback',
  passport.authenticate('gitlab'),
  (req, res) => {
    console.log("Signed in as " + req.user.username);
    res.redirect('/');
  }
);

router.get('/signout', (req, res) => {
  console.log('GET: /auth/signout');

  delete _tokenStore[req.user.id];

  req.logout();
  delete req.session;

  res.redirect(config.gitlab.url);
});

module.exports = router;
