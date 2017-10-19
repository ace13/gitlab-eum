'use strict';

import Vue from 'vue';
import App from './App.vue';

require('bootstrap');

Vue.use(require('vue-model'));

new Vue({
  el: '#app',
  render: h => h(App)
});
