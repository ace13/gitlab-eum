'use strict';

import Vue from 'vue';
import VueModel from 'vue-model';
import App from './App.vue';
import { default as $ } from 'jquery';

// To make bootstrap happy about running through browserify
const Popper = require('popper');
global.jQuery = global.$ = $;
global.Popper = Popper;
const bootstrap = require('bootstrap');

Vue.use(VueModel, {
  user: require('./models/user'),
});

VueModel.classes.defaults.http.getDataFromResponse = function(response) {
  return response.data;
};

global.Vue = Vue;
global.Bus = new Vue();
global.App = new Vue({
  el: '#app',

  models: [
    'user'
  ],

  render: h => h(App)
});
