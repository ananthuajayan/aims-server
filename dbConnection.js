const mysql = require('mysql');

const connection = mysql.createPool({
  // connectionLimit: 10,
  host: "srv1132.hstgr.io",
  user: "u160357475_aims_client",
  password: "MysqlAdmin@123",
  database: "u160357475_aims",
});

connection.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
  connection.release();
});

module.exports = connection;
