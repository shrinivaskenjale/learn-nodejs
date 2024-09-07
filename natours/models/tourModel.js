const mongoose = require("mongoose");
const slugify = require("slugify");

const { Schema } = mongoose;

const tourSchema = new Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name."],
    unique: true,
    trim: true,
    minLength: [10, "A tour name must be at least 10 characters long."],
    maxLength: [40, "A tour name must be at most 40 characters long."],
  },

  slug: {
    type: String,
  },

  duration: {
    type: Number,
    required: [true, "A tour must have a duration."],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size."],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty."],
    enum: {
      values: ["easy", "medium", "difficult"],
      message: "Difficulty value {VALUE} is not supported.",
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, "Rating must be between 1 and 5."],
    max: [5, "Rating must be between 1 and 5."],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price."],
  },
  priceDiscount: {
    type: Number,
    // 'this' refers to current document being validated only when creating a new document.
    validate: {
      validator: function (value) {
        return value < this.price;
      },
      message: "Discount({VALUE}) should be less than price.",
    }, // Discount should be less than price
  },
  summary: {
    type: String,
    trim: true,
    required: [true, "A tour must have a summary."],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    trim: true,
    required: [true, "A tour must have a cover image."],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  startDates: [Date],
  // In order to really create new documents and then embed them into another document, we actually need to create an array,
  // Embedding
  startLocation: {
    // Object - GeoJSON
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    // Array of numbers - [long, lat] - Usually order is latitude and then logitude but it is different in GeoJSON.
    //
    coordinates: [Number],
    address: String,
    description: String,
  },
  // In order to really create new documents and then embed them into another document, we actually need to create an array,
  // Embedding
  locations: [
    {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number,
    },
  ],
  // Embedding - Idea is that admin will select the ids of users as guide when creating a new tour, then we will fetch those users from DB and embed those documents here.
  // guides: Array,

  // Referencing - So all we save on a certain tour document is the IDs of the users that are the tour guides for that specific tour. Then when we query the tour, we want to automatically get access to the tour guides.
  // Just like 'locations', we need array to indicate that these will be some sub-documents/embedded documents.
  // use a process called populate in order to actually get access to the referenced tour guides whenever we query for a certain tour.
  guides: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

// ===================
// Virtuals
// ===================

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Set to show virtual getters in plain JS object
tourSchema.set("toObject", { getters: true });

// Set to show virtual getters in JSON
tourSchema.set("toJSON", { virtuals: true });

// ===================
// Virtual Populate
// ===================
// We want all reviews of one tour when we query a tour. One option is to first query the tour and then using its id, query all reviews that contain that id. Other option is to implement child referencing in tours schema but then array would grow indefinitly and so not a feasible solution.
// Mongoose solves this problem with virtual populate. It adds virtual property on the documents using references between 2 models.
// Use virtual populate if you have implemented parent referencing but want query results like child referencing when querying parent collection/model.

tourSchema.virtual("reviews", {
  // ref - Referenced model.
  ref: "Review",
  // foreignField - Field in referenced model where reference to current model is stored.
  foreignField: "tour",
  // localField - Field in current model where referenced field is stored.
  localField: "_id",
});

// ===================
// Middleware
// ===================

// Middlewares work only when save() or create() methods are used. Middlewares do not work if you use methods like findByIdAndUpdate(), because changes are directly forwarded to MongoDB without any validation. Same applies to Schema validators.
// In  middlewares, call next() to move to next middleware.

// Middleware to create slug for tour before saving it to db
tourSchema.pre("save", function (next) {
  // this - current document - document middleware
  this.slug = slugify(this.name, {
    lower: true,
  });

  // In  middlewares, call next() to move to next middleware.
  next();
});

// Middleware to add populate query to find queries.
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});

// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

// ===================
// Model
// ===================

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
