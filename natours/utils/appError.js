// All errors created using this class will be operational errors.
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // 4XX - fail
    // 5XX - error
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";

    // We will send error messages to client only if the error is operational (in our case created using AppError class).
    this.isOperational = true;

    // https://lucasfcosta.com/2017/02/17/JavaScript-Errors-and-Stack-Traces.html

    // https://nodejs.org/dist/latest-v16.x/docs/api/errors.html#errorcapturestacktracetargetobject-constructoropt
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
