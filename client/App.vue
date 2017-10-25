<template>
  <div>
    <div class="w-100 text-center">
      <!-- TODO -->
      <h1>&lt;Header&gt;</h1>
    </div>

    <div id="app" class="container mt-5 pt-3 pb-1 rounded">
      <button class="m-1 btn btn-success" @click="showCreationForm = !showCreationForm" v-if="!showCreationForm">New External User</button>
      <transition name="slide-fade">
        <user-creation v-if="showCreationForm" v-on:closed="showCreationForm = false"></user-creation>
      </transition>

      <h1 class="mt-4 mb-3">External users:</h1>
      <ul class="list-unstyled">
        <li v-for="user in external" v-bind:user-id="user" is="external-user"></li>
      </ul>
    </div>

    <div class="position-absolute w-100 text-center" style="bottom: 0px;">
      <h6 class="text-muted font-weight-light">&copy; Linköpings University - Available for contributing on our <a href="https://gitlab.liu.se/aleol57/gitlab-eum">GitLab</a></h6>
    </div>
  </div>
</template>

<script>
import ExternalUser from './ExternalUser.vue';
import UserCreation from './UserCreation.vue';

export default {
  name: 'app',

  data () {
    return {
      showCreationForm: false,

      external: [ 1, 4 ] 
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
</style>
