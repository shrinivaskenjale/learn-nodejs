require("dotenv").config();
const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");
const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const Review = require("../models/reviewModel");

mongoose.connect(process.env.DATABASE, {
  dbName: "natours",
});

async function importDataToDB() {
  try {
    const toursJSON = await fs.readFile(
      path.join(__dirname, "data", "tours.json")
    );
    const reviewsJSON = await fs.readFile(
      path.join(__dirname, "data", "reviews.json")
    );
    const usersJSON = await fs.readFile(
      path.join(__dirname, "data", "users.json")
    );
    const tours = JSON.parse(toursJSON);
    const reviews = JSON.parse(reviewsJSON);
    const users = JSON.parse(usersJSON);

    await Tour.create(tours);
    // Turn off validators and also comment out the save middlewares to avoid password encryption.
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("👍 Imported data to DB successfully");
  } catch (error) {
    console.log(`💥 ${error.message}`);
  }
  process.exit();
}

async function deleteDBData() {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("🧹 Cleared database successfully");
  } catch (error) {
    console.log(`💥 ${error.message}`);
  }
  process.exit();
}

if (process.argv[2] === "--import") {
  // => node data-script.js --import
  importDataToDB();
} else if (process.argv[2] === "--clear") {
  // => node data-script.js --clear
  deleteDBData();
}
