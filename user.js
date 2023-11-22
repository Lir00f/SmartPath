const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wtpfhm123',
  database: 'pis2'
});


class User {
    constructor(username, passwordHash) {
      this.username = username;
      this.passwordHash = passwordHash;
    }
  
    save(callback) {
      connection.query(
        'INSERT INTO users (username, password_hash) VALUES (?, ?)',
        [this.username, this.passwordHash],
        (error, results) => {
          if (error) {
            callback(error, null);
          } else {
            callback(null, results);
          }
        }
      );
    }
  }
  
  

  process.on('exit', () => {
    connection.end();
  });
  

  module.exports = User;