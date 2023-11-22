const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wtpfhm123',
  database: 'pis2'
});

module.exports = connection;