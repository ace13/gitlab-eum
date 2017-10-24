<template>
  <div class="m-2 md-w-25">
    <h6 class="pb-2">Create user:</h6>

    <form @submit.prevent="validate() && submit()" novalidate>
      <input type="text" class="mt-2 form-control" v-bind:class="{ 'is-invalid': errors.fullname, 'is-valid': submitted && !errors.fullname }" placeholder="Full Name" aria-label="Full name" v-model.trim="fullname" required/>
      <div class="invalid-feedback" v-show="errors.fullname">
        {{ errors.fullname }}
      </div>

      <input type="email" class="mt-2 form-control" v-bind:class="{ 'is-invalid': errors.email, 'is-valid': submitted && !errors.email }" placeholder="email@example.com" aria-label="Email" v-model.trim="email"required/>
      <div class="invalid-feedback" v-show="errors.email">
        {{ errors.email }}
      </div>

      <div class="mt-2 input-group" v-bind:class="{ 'is-invalid': errors.username, 'is-valid': submitted && !errors.username }">
        <span class="input-group-addon" id="username-at">@</span>
        <input type="text" class="form-control" v-bind:placeholder="username_placeholder" aria-label="Username" aria-describedby="username-at" v-model.trim="username"/>
      </div>
      <div class="d-block invalid-feedback" v-show="errors.username">
        {{ errors.username }}
      </div>

      <div class="mt-2">
        <button class="btn btn-primary" type="submit">Submit</button>
        <button class="btn btn-danger" @click.prevent="close()">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'user-creation',

  data () {
    return {
      errors: { },

      submitted: false,
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
  },

  methods: {
    close: function() {
      console.log("Closing user creation");
      this.$emit('closed');
    },

    validate: function() {
      this.submitted = true;
      this.errors = { };

      if (!this.fullname) {
        this.errors.fullname = "Must specify a name";
      }
      if (!this.email || !this.email.includes('@') || !this.email.includes('.')) {
        this.errors.email = "Specify a valid email address";
      }
      let username = this.username || (this.fullname && this.username_placeholder);

      if (!username) {
        this.errors.username = "Must specify a name or username";
      } else {
        // API call?
        this.errors.username = "Username must be unique";
      }

      return Object.keys(this.errors).length == 0;
    },

    submit: function() {
      console.log("Submitting new external user");
      this.close();
    }
  }
}
</script>

<style scoped>
/* Taken from https://github.com/lilpug/bootstrap-4-beta-validation */
/* Removes the default display as none by bootstrap as we want to maintain our own validation */
.invalid-feedback {
    display:inherit;
}

/* allows the is-invalid to be put on the input group div */
.input-group.is-invalid .input-group-addon {
    color: #a94442;
    background-color: #f2dede;
    border-color: #a94442;
}
.input-group.is-invalid .input-group-addon, .input-group.is-invalid input {
    border-color: #dc3545 !important;
}

/* allows the is-valid to be put on the input group div */
.input-group.is-valid .input-group-addon {
    color: #28a745;
    background-color: #dff0d8;
    border-color: #28a745;
}
.input-group.is-valid .input-group-addon, .input-group.is-valid input {
    border-color: #28a745 !important;
}

/* adjusts the top and bottom spacing for multiple error message output */
.invalid-feedback p {
    margin-top:5px;
    margin-bottom:0px;
}
</style>
