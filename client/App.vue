<template>
  <div>
    <div class="container text-center mb-4">
      <!-- TODO -->
      <img src="LiU_primary_black.png" alt="Linköpings University" style="height: 96px"/>
      <h4>External User Manager</h4>
    </div>

    <div class="container my-4" v-if="user">
      <div id="user" class="text-right font-weight-light">

        <a href="/auth/signout">Signed in as <img class="mini-avatar rounded-circle" v-bind:src="user.avatar_url" v-bind:alt="user.username"/>{{ user.name }} <i class="fa fa-sign-out"></i></a>
      </div>
      <div id="app" class="pt-3 px-3 pb-1 rounded">
        <transition-group name="fade" mode="out-in" tag="div">
          <div v-for="(alert, alert_id) in alerts" v-bind:key="alert_id">
            <div class="alert" :class="'alert-' + alert.class" role="alert">
              <strong>{{ alert.reason }}</strong>, failed to {{ alert.action }}
              <button type="button" class="close" aria-label="Close" @click.prevent="alerts.splice(alert_id, 1)">
                <span aria-hidden="true">&times;</span>
              </button>
            </diV>
          </div>
        </transition-group>

        <transition name="fade" mode="out-in" appear>
          <user-creation v-if="showCreationForm" v-on:closed="closeCreator($event)"></user-creation>
          <div class="p-2" v-else>
            <h4>Add external users</h4>
            <p>Employees and students are allowed to create external users for collaboration with actors outside of Linköpings University.<br/>
              This application will track and allow creation of such external users, up to a number configurable by the administrators.<br/></p>
            <button class="btn btn-success" :disabled="user.eum_settings.external_limit >= 0 && external.length >= user.eum_settings.external_limit" @click="showCreationForm = !showCreationForm">New External User</button>
          </div>
        </transition>

        <h2 class="mt-4 mb-3">Existing external users: ({{ external.length }}/<span v-if="user.eum_settings.external_limit >= 0">{{ user.eum_settings.external_limit }}</span><span v-else>&infin;</span>)</h2>
        <hr/>
        <transition name="fade" mode="out-in">
          <ul class="list-unstyled" is="transition-group" name="flip-list" v-if="external">
            <li v-for="user in external" v-bind:user-obj="user" :key="user.id" is="external-user"></li>
          </ul>
          <div class="m-5 media" v-else>
            <i class="fa fa-spinner fa-spin fa-2x mr-3 align-self-top"></i>
            <div class="media-body">
              <h3>Loading external user list ...</h3>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div class="container my-5" v-else>
      <div id="app" class="rounded p-5 text-center">
        <h2 class="mt-2"><i class="fa fa-spin fa-spinner"></i> Signing in...</h2>
        <p class="font-weight-light text-muted">(<a href="/auth/signin">Click here if not redirected successfully <i class="fa fa-sign-in"></i></a>)</p>
      </div>
    </div>

    <div id="footer" class="position-static container text-center">
      <h6 class="text-muted font-weight-light">&copy; Linköpings University - Available for contributing on our <a href="https://gitlab.liu.se/aleol57/gitlab-eum">GitLab</a></h6>
    </div>
  </div>
</template>

<script>
import ExternalUser from './ExternalUser.vue';
import UserCreation from './UserCreation.vue';

import axios from 'axios';

export default {
  name: 'app',

  data () {
    return {
      showCreationForm: false,

      alerts: [],
      external: [],
      user: { eum_settings: {} }
    }
  },

  created () {
    Bus.$on('alert', (alert) => { this.alerts.push(alert) });

    axios.get('/users')
      .then((response) => {
        this.external = response.data
          .map((id) => this.$model('user', {id: id}));
      }, (error) => {
        console.log("Users request failed:");
        console.log(error);

        Bus.$emit('alert', {
          class: 'danger',
          action: "list users",
          reason: error.response.data.message
        });
      });

    axios.get('/auth')
      .then((response) => {
        console.log("Signed in as " + response.data.username);
        this.user = response.data;
        console.log(this.user);
      }, (err) => {
        this.user = null;

        window.location.href = '/auth/signin';
      });
  },

  methods: {
    closeCreator (ev) {
      this.showCreationForm = false;

      if (ev && typeof(ev) === 'object') {
        this.external.push(this.$model('user', {id: ev.id}));
      }
    }
  },

  components: {
    ExternalUser,
    UserCreation
  }
}
</script>

<style scoped>
div#app {
  background-color: #fff;
}

div#footer {
  bottom: 0px;
  z-index: -1;
}

.mini-avatar {
  width: 24px;
  height: 24px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.flip-list-enter-active, .flip-list-move {
  transition: all .1s;
}

.flip-list-enter, .flip-list-to {
  opacity: 0;
  transform: translateX(120px);
}
</style>
