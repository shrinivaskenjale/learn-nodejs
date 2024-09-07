const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

// Middleware to add tourId to query from params so that filtering of reviews happens bases on tour.
exports.setTourId = (req, res, next) => {
  if (req.params.tourId) {
    req.query.tour = req.params.tourId;
  }
  next();
};

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.setTourUserIds = (req, res, next) => {
  // Don't accept user for the review from body/url parameters, instead use currently logged in user to create new review.
  if (!req.body.tour) req.body.tour = req.params.tourId;
  req.body.user = req.user._id;
  next();
};

exports.createReview = factory.createOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);
