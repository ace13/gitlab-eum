<template>
  <div id="app" class="container mt-5 pt-3 pb-1 rounded">
    <!-- Header goes here -->

    <button class="m-1 btn btn-success" @click="showCreationForm = !showCreationForm" v-if="!showCreationForm">New External User</button>
    <transition name="slide-fade">
      <user-creation v-if="showCreationForm" v-on:closed="showCreationForm = false"></user-creation>
    </transition>

    <h1 class="mt-4 mb-3">External users:</h1>
    <ul class="list-unstyled">
      <li v-for="user in external" v-bind:user-id="user" is="external-user"></li>
    </ul>
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
