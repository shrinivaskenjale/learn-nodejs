process.on("uncaughtException", (err) => {
  console.log("Shutting down 💥");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

// ==================
// Config
// ==================

console.log(process.env.NODE_ENV);

mongoose.connect(process.env.DATABASE, {
  dbName: "natours",
});

const PORT = process.env.PORT || 8000;

// ==================
// Start server
// ==================

const server = app.listen(PORT, () => {
  console.log("Backend server running ✅");
});

process.on("unhandledRejection", (err) => {
  console.log("Shutting down 💥");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
  // 0 - success
  // 1 - uncaught exception
});

// mongoose.Schema.Types
// mongoose.SchemaTypes
// mongoose.Types
