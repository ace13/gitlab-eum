'use strict';

var User = module.exports = {
  attributes: [
    // Important information
    'id',
    'is_admin',
    'external',
    
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
    baseRoute: 'https://gitlab.liu.se/api/v4/users/',

    actions: {
      update: false
    }
  },
};
