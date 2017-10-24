<template>
  <li class="media mt-1">
    <img v-bind:src="user.avatar_url" class="d-flex align-self-center mr-3 user-avatar" alt="Avatar"/>
    <div class="media-body">
      <h4 class="mt-0">{{ user.name }}</h4>
      <p class="text-muted"><a v-bind:href="user.web_url">@{{ user.username }}</a> - Created at {{ user.created_at_readable }}</p>

      <template v-if="false">
        <a href="#" @click.prevent="user.http.refresh()" class="btn btn-sm btn-primary" title="Reload User Data"><i class="fa fa-cog"></i></a>
        <a href="#" @click.prevent="user.http.destroy()" class="btn btn-sm btn-danger" title="Remove User"><i class="fa fa-eraser"></i></a>
      </template>
    </div>
  </li>
</template>

<script>
export default {
  name: 'external-user',
  
  props: [
    'userId'
  ],

  data () {
    return {
      user: { id: this.userId }
    }
  },

  created () {
    this.user = this.$model('user', this.user)
    this.user.http.fetch()
  }
}
</script>

<style scoped>
.user-avatar {
  width: 64px;
  height: 64px;
}
</style>
