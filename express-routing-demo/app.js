const mongoose = require("mongoose");

const { Schema } = mongoose;

mongoose.connect(
  "mongodb+srv://sskenjale22:jE67ugYxDHuT9JWk@cluster0.yr6rlvr.mongodb.net/?retryWrites=true&w=majority",
  {
    dbName: "test",
  }
);

const breakfastSchema = new Schema({
  eggs: {
    type: Number,
    min: [6, "Too few eggs"],
    max: 12,
  },
  bacon: {
    type: Number,
    required: [true, "Why no bacon?"],
  },
  drink: {
    type: String,
    enum: ["Coffee", "Tea"],
    required: function () {
      return this.bacon > 3;
    },
  },
});
const Breakfast = mongoose.model("Breakfast", breakfastSchema);

const badBreakfast = new Breakfast({
  eggs: 8,
  bacon: 4,
  drink: null,
});

badBreakfast.validate();

db.users.find({ $or: [{ name: { $gt: "k" } }, { name: { $eq: "john" } }] });

db.user.find({
  name: {
    $or: [{ $gt: "k" }, { name: { $eq: "john" } }],
  },
});
