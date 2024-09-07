const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Send error message for operational errors.
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // This log will be visible in console of hosting platform.
    console.error(`ERROR 💥 ${err}`);

    // Send generic message for programming/unknown errors.
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // Errors thrown by mongoose have unique names but, errors thrown by mongodb driver are named 'MongoError' with unique 'code' property.

    // Handle invalid db ids
    if (err.name === "CastError") {
      err = handleCastErrorDB(err);
    }

    // Handle duplicate fields
    if (err.code === 11000) {
      err = handleDuplicateFieldDB(err);
    }

    // Handle validation errors
    if (err.name === "ValidationError") {
      err = handleValidationErrorDB(err);
    }

    // Handle JWT validation errors
    if (err.name === "JsonWebTokenError") {
      err = handleJWTValidationError(err);
    }

    // Handle JWT expired errors
    if (err.name === "TokenExpiredError") {
      err = handleJWTExpiredError(err);
    }

    sendErrorProd(err, res);
  }
};

function handleCastErrorDB(err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}

function handleDuplicateFieldDB(err) {
  const duplicateValues = Object.values(err.keyValue).join(", ");
  const message = `Duplicate field values: ${duplicateValues}`;
  return new AppError(message, 400);
}

function handleValidationErrorDB(err) {
  const errorMessages = Object.values(err.errors)
    .map((value) => value.message)
    .join(" ");
  const message = `Invalid input data. ${errorMessages}`;
  return new AppError(message, 400);
}

function handleJWTValidationError(err) {
  const message = "Invalid token. Please log in again.";
  return new AppError(message, 401);
}

function handleJWTExpiredError(err) {
  const message = "Your token has expired. Please log in again.";
  return new AppError(message, 401);
}
