<template>
  <div id="app" class="container">
    <h1>External users:</h1>
    <ul class="list-unstyled">
      <li v-for="user in external" class="media">
        <img v-bind:src="user.avatar_url" class="mr-3 user-avatar" alt="Avatar"/>
        <div class="media-body">
          <h4>{{ user.name }}</h4>
          <p class="text-muted"><a v-bind:href="user.web_url">@{{ user.username }}</a> - Created at {{ user.created_at }}</p>

          <a href="#" class="btn btn-primary btn-sm" @click="user.http.fetch()" :disabled="user.http.fetchInProgress"><i class="fa fa-cog"></i></a>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      // TODO: Delegate model creation
      external: [ App.$model('user', { id: 1 }), App.$model('user', { id: 2 }) ] 
    }
  },
}
</script>

<style scoped>
.user-avatar {
  width: 48px;
  height: 48px;

  border-radius: 5px;
}
</style>
