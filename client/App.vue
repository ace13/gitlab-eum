<template>
  <div id="app" class="container">
    <!-- Header goes here -->

    <transition name="slide-fade">
      <user-creation v-if="showCreationForm"></user-creation>
    </transition>

    <div class="d-flex flex-row mb-3">
      <h1 class="mr-auto">External users:</h1>
      <button class="m-2 btn btn-success" @click="showCreationForm = !showCreationForm">New External User</button>
    </div>

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

</style>
