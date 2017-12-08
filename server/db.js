'use strict';

const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool();

pool.on('error', (err) => {
  console.log("DB Pool error occured;");
  console.log(err);
});

const seed = `
CREATE TABLE IF NOT EXISTS external_users (
  id SERIAL,
  user_id INTEGER,
  owner_id INTEGER NOT NULL,
  username VARCHAR(256) NOT NULL,
  date_added TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_events (
  id SERIAL,
  event VARCHAR(32) NOT NULL,
  user_id INTEGER NOT NULL,
  message TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
`;

module.exports = pool;
