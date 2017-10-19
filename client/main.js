'use strict';

import Vue from 'vue';
import App from './App.vue';
import { default as $ } from 'jquery';

// To make bootstrap happy about running through browserify
global.$ = $;
global.jQuery = $;

const bootstrap = require('bootstrap');

import VueModel from 'vue-model';

Vue.use(VueModel, {
  user: require('./models/user'),
});

VueModel.classes.defaults.http.getDataFromResponse = function(response) {
  return response.data;
};

global.Vue = Vue;
global.App = new Vue({
  el: '#app',

  models: [
    'user'
  ],

  render: h => h(App)
});
