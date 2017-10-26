<template>
  <div class="m-2 md-w-25">
    <h6 class="pb-2">Create user:</h6>

    <form class="container" @submit.prevent="validate() && submit()" novalidate>
      <div class="alert alert-danger" role="alert" v-if="errors && errors.general">
        {{ errors.general }}
      </div>

      <div class="row mt-4">
        <div class="col-md-2">
          <label for="inputName">Full Name: </label>
        </div>
        <div class="col-md-10">
          <input type="text" id="inputName" class="form-control" v-bind:class="{ 'is-invalid': errors.fullname, 'is-valid': validated && !errors.fullname }" placeholder="Full Name" aria-label="Full name" v-model.trim="user.name" required/>
          <div class="invalid-feedback" v-if="errors && errors.fullname">
            {{ errors.fullname }}
          </div>
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-md-2">
          <label for="inputEmail">Email</label>
        </div>
        <div class="col-md-10">
          <input type="email" id="inputEmail" class="form-control" v-bind:class="{ 'is-invalid': errors.email, 'is-valid': validated && !errors.email }" placeholder="email@example.com" aria-label="Email" v-model.trim="user.email"required/>
          <div class="invalid-feedback" v-if="errors && errors.email">
            {{ errors.email }}
          </div>
          <small id="emailHelpBlock" class="form-text text-muted" v-else>
            The user will receive an email on this address to activate their account with.
          </small>
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-md-2">
          <label class="mt-2" for="inputUsername">Username</label>
        </div>
        <div class="col-md-10">
          <div class="input-group" v-bind:class="{ 'is-invalid': errors.username, 'is-valid': validated && !errors.username }">
            <span class="input-group-addon" id="username-at">@</span>
            <input type="text" id="inputUsername" class="form-control" v-bind:placeholder="username_placeholder" aria-label="Username" aria-describedby="username-at" v-model.trim="user.username"/>
          </div>
          <div class="d-block invalid-feedback" v-if="errors && errors.username">
            {{ errors.username }}
          </div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-md-10 offset-md-2">
          <button class="m-0 btn btn-primary" type="submit" :disabled="user.http.inProgress"><i v-if="user.http.storeInProgress" class="fa fa-spinner fa-cog"></i> Submit</button>
          <button class="btn btn-secondary" @click.prevent="reset()" type="reset">Reset</button>
          <button class="btn btn-danger" @click.prevent="close()">Cancel</button>
        </div>
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
      user: { },

      validated: false,
    }
  },

  created () {
    this.user = this.$model('user', this.user);
  },

  computed: {
    username_placeholder: function() {
      if (this.user.name && this.user.name.length > 0) {
        return this.user.name.replace(/\s/g, '.').toLowerCase();
      }

      return 'Username';
    },

    has_errors: function() {
      return Object.keys(this.errors || {}).length !== 0;
    }
  },

  methods: {
    close: function(reason = null) {
      this.$emit('closed', reason);
    },
    reset: function() {
      this.user = this.$model('user');
      this.validated = false;
      this.errors = { };
    },

    validate: function() {
      this.errors = { };

      if (!this.user.name) {
        this.errors.fullname = "Must specify a name";
      }
      if (!this.user.email || !this.user.email.includes('@') || !this.user.email.includes('.')) {
        this.errors.email = "Specify a valid email address";
      }

      var username = this.user.username || (this.user.name && this.username_placeholder);

      if (!username) {
        this.errors.username = "Must specify a name or username";
      }

      this.validated = true;
      return Object.keys(this.errors).length === 0;
    },

    submit: async function() {
      if (!this.validated || this.has_errors) {
        console.log("Attempting to submit with errors.");
        return false;
      }

      var changed_username = false;
      if (!this.user.username) {
        changed_username = true;
        this.user.username = this.username_placeholder;
      }

      try {
        var res = await this.user.http.store();
        console.log("Result:");
        console.log(res);
      } catch(err) {
        console.log(err);
        if (err.response.status === 401) {
          this.$set(this.errors, 'general', "Server is malconfigured, not allowed to create users");
        } else if (err.response.status === 409) {
          var msg = err.response.data.message || 'General error occurred';
          var token = msg.split(' ')[0].toLowerCase()
          this.$set(this.errors, token, msg);
        } else {
          this.$set(this.errors, 'general', "Something went wrong when processing the request, error " + err.response.status + ";<br/><pre>" + err.response.statusText + "</pre>");
        }

        this.user.username = null;
        return false;
      }

      console.log(this.user);

      this.close(this.user);
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
