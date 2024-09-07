// ===================
// Imports
// ===================
const express = require("express");

// ===================
// Config
// ===================
const port = 5000;
const app = express();

// ===================
// Middlewares
// ===================

// If errors are thrown inside async code, express does not automatically execute error handling middlewares and thus server crashes. In this case we have to catch the errors and call next() with any parameter (generally error object) to tell express to execute error handling middleware.
app.get("/async", async (req, res, next) => {
  try {
    // const data = await Promise.resolve("resolved");
    const data = await Promise.reject("rejected");
    res.send({
      message: data,
    });
  } catch (error) {
    next(error);
  }
});

// If errors are thrown inside sync code, express automatically executes error handling middlewares.
app.get("/sync", (req, res, next) => {
  const error = new Error();
  error.name = "SomethingError";
  error.message = "This error happened due to something.";
  throw error;
});

// ===================
// Error handling middlewares
// ===================
app.use((err, req, res, next) => {
  console.log(err);
  res.send({
    message: "Error occured.",
  });
});
// ===================
// Listen
// ===================
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
