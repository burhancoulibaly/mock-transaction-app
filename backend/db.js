const mysql = require('mysql'),
      dotenv = require('dotenv'),
      envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

dotenv.config({ path: envFile });

const pool = mysql.createPool({
    host     : 'localhost',
    user     : 'menekou',
    password :  process.env.MYSQL_PASSWORD,
    database : 'mock_transaction_app'
});

module.exports = pool;