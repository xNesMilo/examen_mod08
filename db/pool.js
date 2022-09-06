const { Pool } = require('pg')
const secrets = require('../secrets')

const config = {
  user: secrets.db_user,
  host: 'localhost',
  database: secrets.db_name,
  password: secrets.db_pass,
  min: 3,
  max: 6,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 2000,
  port: 5432
}
const pool = new Pool(config)

module.exports = pool;