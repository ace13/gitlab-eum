'use strict';

var express      = require('express');
var passport     = require('passport');
// var ensureLogin  = require('connect-ensure-login').ensureLoggedIn;
// var ensureLogout = require('connect-ensure-login').ensureLoggedOut;
// var config       = require('./config');

var app = express();

app.use(require('body-parser').json());

app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css', express.static(__dirname + '/node_modules/font-awesome/css'));
app.use('/fonts', express.static(__dirname + '/node_modules/font-awesome/fonts'));

app.use('/users', require('./server/users'));

app.listen(8080, () => {
});
