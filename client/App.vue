<template>
  <div id="app" class="container">
    <h1 class="mb-3">External users:</h1>
    <ul class="list-unstyled">
      <li v-for="user in external" v-bind:user-id="user" is="external-user"></li>
    </ul>
  </div>
</template>

<script>
import ExternalUser from './ExternalUser.vue';

export default {
  name: 'app',

  data () {
    return {
      external: [ 1, 2 ] 
    }
  },

  components: {
    ExternalUser,
  }
}
</script>

<style scoped>

</style>
