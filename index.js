'use strict';

var express      = require('express');
var ensureLogin  = require('connect-ensure-login').ensureLoggedIn;
var passport     = require('passport');
var config       = require('./config');

var app = express();

app.use(require('body-parser').json());
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: config.session.secret, store: config.session.store, resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css', express.static(__dirname + '/node_modules/font-awesome/css'));
app.use('/fonts', express.static(__dirname + '/node_modules/font-awesome/fonts'));

app.use('/auth', require('./server/auth'));
app.use('/users', ensureLogin('/auth/signin'), require('./server/users'));

app.listen(8080, () => {
  console.log("Listening on 8080");
});
