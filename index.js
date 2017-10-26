'use strict';

var express      = require('express');
var passport     = require('passport');
var ensureLogin  = require('connect-ensure-login').ensureLoggedIn;
var config       = require('./config');

var app = express();

app.use(require('body-parser').json());
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: config.express.session_secret, resave: false, saveUninitialized: false }));

app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css', express.static(__dirname + '/node_modules/font-awesome/css'));
app.use('/fonts', express.static(__dirname + '/node_modules/font-awesome/fonts'));

app.use('/auth', require('./server/auth'));
app.use('/users', ensureLogin('/auth'), require('./server/users'));

app.listen(8080, () => {
});
