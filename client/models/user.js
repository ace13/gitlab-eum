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
    baseRoute: '/users/',

    actions: {
      store: {
        data: {
          only: ['username','email','name'],
          with: [{
            reset_password: true,
            external: true
          }]
        }
      },
      update: false,
      block: {
        method: 'POST',
        route: '{id}/block',
        apply: true,
        data: false,
      },
      unblock: {
        method: 'POST',
        route: '{id}/unblock',
        apply: true,
        data: false,
      }
    }
  },
};
