'use strict';

const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool();

// TODO: Figure out the perfect db layout, or get the one from IDA
const seed = `
CREATE TABLE IF NOT EXISTS external_users (
  id INTEGER PRIMARY KEY,
  owner_id INTEGER NOT NULL,
  username VARCHAR(256) NOT NULL,
  date_added TIMESTAMP DEFAULT NOW()
);
`;

module exports = pool;
