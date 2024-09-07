// get the client
import mysql from "mysql2/promise";

export let connection;

async function createConnection() {
  // create the connection
  connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "XKdS1i*12Hhf",
    database: "testdb",
  });
}

createConnection();
