<template>
  <li class="media mt-2 user-object">
    <img v-bind:src="user.avatar_url" class="d-flex align-self-center mr-3 rounded-circle user-avatar" alt="Avatar"/>
    <div class="media-body">
      <h4 class="mt-0">{{ user.name }} &lt;<a :href="'mailto:'+user.name+' <'+user.email+'>'">{{ user.email }}</a>&gt;</h4>
      <p class="text-muted"><a v-bind:href="user.web_url">@{{ user.username }}</a> - <span :class="{'text-danger': user.state != 'active'}">{{ user.state }}</span> - Created at {{ user.created_at | readable_date }}</p>

      <!-- Read if current user is an admin, show advanced features -->
      <template v-if="false">
        <a href="#" @click.prevent="user.http.fetch()" class="btn btn-sm btn-outline-primary" title="Reload User Data"><i class="fa fa-cog"></i></a>
        <a href="#" @click.prevent="user.state == 'blocked' ? user.http.unblock() : user.http.block()" class="btn btn-sm btn-outline-warning" :title="user.state == 'blocked' ? 'Unblock' : 'Block'"><i class="fa" :class="{ 'fa-lock': user.state != 'blocked', 'fa-unlock': user.state == 'blocked' }"></i></a>
        <a href="#" @click.prevent="user.http.destroy()" class="btn btn-sm btn-outline-danger" title="Remove User"><i class="fa fa-eraser"></i></a>
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

.user-object {
  transition: background-color 0.2s;
  border-radius: 50px;
}
.user-object:hover {
  background-color: #fafafa;
  border-radius: 50px;
}
</style>
