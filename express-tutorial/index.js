const express = require("express");

const path = require("path");

const shop = require("./routes/shop");
// const learn = require("./routes/learn");
const db = require("./utils/database");

// =================
// CONFIGURATION
// =================
const app = express();
const port = 3000;

// =================
// MIDDLEWARES
// =================
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Temporary middleware to add user object to request.
app.use(async (req, res, next) => {
  const [result] = await db.query("select * from users where id = ?", [1]);

  if (result[0]) {
    req.user = result[0];
    return next();
  }

  // User does not exist
  await db.query(
    "insert into users (id, firstName, lastName, email) values (1, 'John', 'Cena', 'jc@shop.com')"
  );

  [result] = await db.query("select * from users where id = ?", [1]);
  req.user = result[0];
  next();
});

// app.use("/learn", learn);
app.use(shop);

app.use((req, res) => {
  res.status(404).send({
    message: "Resource not found.",
  });
});

// =================
// LISTEN
// =================
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
