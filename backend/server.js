const express = require('express'),
      app = express(),
      dotenv = require('dotenv'),
      envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env',
      cors = require('cors'),
      bodyParser = require('body-parser'),
      mysql = require('mysql'),
      events = require('./events'),
      server = require('http').createServer(app);

dotenv.config({ path: envFile });

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'menekou',
    password :  process.env.MYSQL_PASSWORD,
    database : 'mock_transaction_app'
});

connection.connect();

app.use(cors());
app.use(events(connection));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


server.listen(process.env.PORT || 3000);
console.log(`Server listening on port: ${process.env.PORT || 3000}`);
