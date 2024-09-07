// ==================
// Imports
// ==================

const express = require("express");

// ==================
// Config
// ==================
const app = express();

// ==================
// Middlewares
// ==================
app.use(express.static("public"));

app.get("/file/sendfile", (req, res) => {
  res.sendFile(__dirname + "/files/dummy.pdf");
});

app.get("/file/download", (req, res) => {
  res.download("files/dummy.pdf");
});

// ==================
// Listen
// ==================
app.listen(5000, (err) => {
  if (err) {
    throw err;
  }

  console.log("Server listening of port 5000");
});
