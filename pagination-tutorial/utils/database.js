const mysql = require("mysql2");

// create the pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "XKdS1i*12Hhf",
  database: "testdb",
});

// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();

module.exports = promisePool;

// Call end() on promisePool object to stop the Connection.
