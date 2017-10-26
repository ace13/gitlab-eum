<template>
  <li class="media mt-2 user-object">
    <img v-bind:src="user.avatar_url" class="d-flex align-self-center mr-3 rounded-circle user-avatar" alt="Avatar"/>
    <div class="media-body">
      <h4 class="mt-0">{{ user.name }}</h4>
      <p class="text-muted"><a v-bind:href="user.web_url">@{{ user.username }}</a> - Created at {{ user.created_at | readable_date }}</p>

      <!-- Read if current user is an admin, show advanced features -->
      <template v-if="false">
        <a href="#" @click.prevent="user.http.fetch()" class="btn btn-sm btn-primary" title="Reload User Data"><i class="fa fa-cog"></i></a>
        <a href="#" @click.prevent="user.http.destroy()" class="btn btn-sm btn-danger" title="Remove User"><i class="fa fa-eraser"></i></a>
      </template>
    </div>
  </li>
</template>

<script>
export default {
  name: 'external-user',

  props: [
    'userObj'
  ],

  data () {
    return {
      user: {}
    }
  },

  created () {
    if (typeof(this.userObj) === 'object') {
      this.user = this.userObj;
    } else {
      this.user = this.$model('user', { id: this.userObj });
    }
    this.user.http.fetch();
  },

  filters: {
    readable_date (date, locale = 'sv-SE') {
      return new Date(date).toLocaleDateString(locale);
    }
  }
}
</script>

<style scoped>
.user-avatar {
  width: 64px;
  height: 64px;
}

.user-object:hover {
  background-color: #fcfcfc;
  border-radius: 10px;
}
</style>
