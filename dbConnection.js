const mysql = require('mysql');

const connection = mysql.createConnection({
    connectionLimit: 10,
    host: "srv1132.hstgr.io", 
    user: "u160357475_aims_client", 
    password: "MysqlAdmin@123", 
    database: "u160357475_aims",
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

module.exports = connection;
