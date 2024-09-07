const path = require("path");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController");

// ==================
// Config
// ==================
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP. Please try again after some time.",
});

// ==================
// Middlewares
// ==================

app.use("/api", limiter);
app.use(helmet());
app.use(
  express.json({
    limit: "10kb",
  })
);
// Data sanitization - Cleaning the body data. This middleware should come after body parsing middlewares.
// 1. Data sanitization for NoSQL query injection.
// {"email": {"$gt": ""},"password": "password"} this body will sign anyone in if they know password without knowing email.
app.use(mongoSanitize());
// 2. Data sanitization for XSS attack.
// Try sending HTML through some field in body.
app.use(xss());
// Prevent parameter pollution by clearing query string.
// We don't want ?sort=price&sort=name as it will throw error but we need ?duration=5&duration=9.
app.use(
  hpp({
    whitelist: ["duration"],
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// 404
// If we reach to this middleware, means we did not finish request lifecycle and so we do not have route handler for requested route.
app.all("*", (req, res, next) => {
  //   const err = new Error(`Can't find ${req.originalUrl} on this server.`);
  //   err.status = "fail";
  //   err.statusCode = 404;

  const err = new AppError(
    `Can't find ${req.originalUrl} on this server.`,
    404
  );
  next(err);
  // throw err;
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
