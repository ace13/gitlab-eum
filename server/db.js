'use strict';

const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config.postgres);

pool.on('error', (err) => {
  console.log("DB Pool error occured;");
  console.log(err);
});

const seed = `
CREATE TABLE IF NOT EXISTS external_users (
  id SERIAL,
  user_id INTEGER NOT NULL,
  owner_id INTEGER NOT NULL,
  username VARCHAR(256) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_events (
  id SERIAL,
  event VARCHAR(32) NOT NULL,
  user_id INTEGER NOT NULL,
  target_id INTEGER DEFAULT NULL,
  message TEXT DEFAULT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);
`;

(async () => {
  const client = await pool.connect();
  try {
    console.log("Applying database seed.")
    const res = await client.query(seed);
    console.log(res);
  } finally {
    client.release();
  }
})().catch(e => console.log(e.stack));

module.exports = pool;
