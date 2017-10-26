'use strict';

// As taken from the GitLab API
// https://gitlab.liu.se/help/api/users.md#single-user
var User = module.exports = {
  attributes: [
    // Important information
    'id',
    
    // Required attributes for creation
    'username',
    'email',
    'name',

    // For display purposes
    'avatar_url',
    'web_url',

    // Useful metadata
    'created_at',
    'state',
  ],

  http: {
    baseRoute: 'https://gitlab.liu.se/api/v4/users/', // XXX: Move to local endpoint once it exists

    actions: {
      create: {
        only: ['username','email','name'],
        with: [{
          reset_password: true,
          external: true
        }]
      },
      fetch: {
        only: ['id'],
      },
      update: false,
    }
  },

  computed: {
    created_at_readable () {
      return new Date(this.created_at).toLocaleDateString('sv-SE');
    }
  }
};
