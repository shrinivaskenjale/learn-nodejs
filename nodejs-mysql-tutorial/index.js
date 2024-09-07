import express from "express";
import mysql from "mysql2";
import cors from "cors";

// ==============
// CONFIG
// ==============
const app = express();
const port = 5000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "XKdS1i*12Hhf",
  database: "testdb",
});

// ==============
// MIDDLEWARES
// ==============

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "hello world" });
});

// Get all books
app.get("/books", (req, res) => {
  const query = "SELECT * FROM books;";
  connection.query(query, (err, data) => {
    if (err) {
      throw err;
    }

    res.send(data);
  });
});

// Create new book
app.post("/books", (req, res) => {
  const { title, description, cover, price } = req.body;

  const query = "INSERT INTO books(title,description, price, cover) values(?);";
  const values = [[title, description, price, cover]];
  connection.query(query, values, (err, data) => {
    if (err) {
      throw err;
    }

    res.send(data);
  });
});

// Delete a book
app.delete("/books/:bookId", (req, res) => {
  const { bookId } = req.params;

  const query = "DELETE FROM books WHERE id = ?";
  const values = [bookId];

  connection.query(query, values, (err, data) => {
    if (err) {
      throw err;
    }

    res.send(data);
  });
});

// Update a book
app.put("/books/:bookId", (req, res) => {
  const { bookId } = req.params;
  const { title, description, cover, price } = req.body;

  const query = "UPDATE books SET ? WHERE id = ?";
  const values = [{ title, description, cover, price }, bookId];

  connection.query(query, values, (err, data) => {
    if (err) {
      throw err;
    }
    res.send(data);
  });
});

// ==============
// LISTEN
// ==============

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
