'use strict';

var express      = require('express');
var passport     = require('passport');
// var ensureLogin  = require('connect-ensure-login').ensureLoggedIn;
// var ensureLogout = require('connect-ensure-login').ensureLoggedOut;

// var config       = require('./config');

var app = express();
app.use(express.static(__dirname + '/public'));

app.listen(8080, () => {
});
