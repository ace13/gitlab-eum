<template>
  <div class="m-2 w-25">
    <h6 class="pb-2">Create user:</h6>

    <form >
      <input type="text" class="mt-2 form-control" placeholder="User's Full Name" aria-label="Full name" v-model="fullname"/>
      <input type="email" class="mt-2 form-control" placeholder="email@example.com" aria-label="Email" v-model="email"/>
      <div class="mt-2 input-group">
        <span class="input-group-addon" id="username-at">@</span>
        <input type="text" class="form-control" v-bind:placeholder="username_placeholder" aria-label="Username" aria-describedby="username-at" v-model="username"/>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'user-creation',

  data () {
    return {
      fullname: '',
      email: '',
      username: ''
    }
  },

  computed: {
    username_placeholder: function() {
      if (this.fullname && this.fullname.length > 0) {
        return this.fullname.split(' ').join('.').toLowerCase();
      }

      return 'Username';
    }
  }
}
</script>

<style scoped>
</style>
