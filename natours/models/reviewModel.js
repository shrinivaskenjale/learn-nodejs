const mongoose = require("mongoose");

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty."],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // Parent referencing
    tour: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  // Schema options - another way to specify
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ===================
// Middleware
// ===================

// Middleware to fetch referenced docs in review
reviewSchema.pre(/^find/, function (next) {
  // We have to call populate() for each field for multiple references.
  // this.populate({
  //   path: "tour",
  //   select: "name",
  // }).populate({
  //   path: "user",
  //   select: "name photo",
  // });

  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

// ===================
// Model
// ===================

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
