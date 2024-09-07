// This is promise version of mysql api
import express from "express";
import cors from "cors";

import { connection } from "./db.js";

// ==============
// CONFIG
// ==============
const app = express();
const port = 5000;

// ==============
// MIDDLEWARES
// ==============

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "hello world" });
});

// Get all books
app.get("/books", async (req, res) => {
  const query = "SELECT * FROM books;";
  const [data] = await connection.query(query);
  res.send(data);
});

// Create new book
app.post("/books", async (req, res) => {
  const { title, description, cover, price } = req.body;

  const query = "INSERT INTO books(title,description, price, cover) values(?);";
  const values = [[title, description, price, cover]];
  const [data] = await connection.query(query, values);
  res.send(data);
});

// Delete a book
app.delete("/books/:bookId", async (req, res) => {
  const { bookId } = req.params;

  const query = "DELETE FROM books WHERE id = ?";
  const values = [bookId];

  const [data] = await connection.query(query, values);
  res.send(data);
});

// Update a book
app.put("/books/:bookId", async (req, res) => {
  const { bookId } = req.params;
  const { title, description, cover, price } = req.body;

  const query = "UPDATE books SET ? WHERE id = ?";
  const values = [{ title, description, cover, price }, bookId];

  const [data] = await connection.query(query, values);
  res.send(data);
});

// ==============
// LISTEN
// ==============

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
