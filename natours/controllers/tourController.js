const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

// Wrap all async controllers with catchAsync wrapper function.
// It is possible to wrap the function in routes, but we will have to check which functions are async before wrapping them.

exports.getAllTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour, { path: "reviews" });

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

exports.aliasTopCheapTours = (req, res, next) => {
  req.query.sort = "price,-ratingsAverage";
  req.query.limit = "5";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};
