<template>
  <div>
    <div class="w-100 text-center">
      <!-- TODO -->
      <h1>&lt;Header&gt;</h1>
    </div>

    <div id="app" class="container my-5 pt-3 pb-1 rounded">
      <transition name="fade" mode="out-in" appear>
        <user-creation v-if="showCreationForm" v-on:closed="closeCreator($event)"></user-creation>
        <button class="m-1 btn btn-success" @click="showCreationForm = !showCreationForm" v-else>New External User</button>
      </transition>

      <h1 class="mt-4 mb-3">External users:</h1>
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

    <div id="footer" class="position-fixed w-100 text-center">
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

      external: [] 
    }
  },

  created () {
    axios.get('/users')
      .then((response) => {
        this.external = response.data
          .map((id) => this.$model('user', {id: id}));
      });
  },

  methods: {
    closeCreator (ev) {
      console.log("User creator closed with:");
      console.log(ev);
      this.showCreationForm = false;

      if (ev && typeof(ev) === 'object') {
        this.external.unshift(ev);
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
