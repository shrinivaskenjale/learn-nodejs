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

/*
One user can list many products. 
One product can be listed by one user.
FK in products

One user can order many products.
One product can be ordered by many users.
Linking table - orders
FK in orders

One user can have many products in cart.
One product can be in many carts.
Linking table - carts
FK in carts
*/
