// ===============
// Imports
// ===============
const express = require("express");

const db = require("./utils/database");

// ===============
// Config
// ===============
const port = 5000;
const app = express();

// ===============
// Middlewares
// ===============
app.get("/", (req, res) => {
  res.send({
    message: "hello world",
  });
});

app.get("/cars", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const itemsPerPage = 2;
  const itemsToSkip = (page - 1) * itemsPerPage;

  const [results] = await db.query("select * from cars limit ?", [
    [itemsToSkip, itemsPerPage],
  ]);

  const [result] = await db.query("select count(*) as totalCars from cars");
  const totalItems = result[0].totalCars;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  res.send({
    results,
    totalPages,
    currentPage: page,
  });
});

// ===============
// Listen
// ===============
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
