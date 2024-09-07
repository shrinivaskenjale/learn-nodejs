const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Email is not valid."],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minLength: 8,
    // Hide this field by default when documents are queried. Use .select() query to explicitly get this field in results.
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Confirm your password."],
    validate: {
      // This works only on save() and create(). This validation does not work if you use methods like findByIdAndUpdate(), because changes are directly forwarded to MongoDB without any validation. Same applies to middlewares.
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords do not match.",
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  // Instead of deleting user document, we set active field to false so that user can re-activate the account in future. Set 'select' schema type to false in order to hide implementation detail.
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// ===================
// Middlewares
// ===================

// Middleware to encrypt password
userSchema.pre("save", async function (next) {
  // Password should be encrypted only if new user is being created or when password is being updated.
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field.
  // Although passwordConfirm is marked required in schema but what it means is, field is required as input to model but we don't want to persist it in DB so we can set undefined.
  this.passwordConfirm = undefined;
  next();
});

// Middleware to update passwordChangedAt field
userSchema.pre("save", function (next) {
  // If password is not changed or if it is new user, don't update passwordChangedAt field
  if (!this.isModified("password")) {
    return next();
  }

  this.passwordChangedAt = Date.now();
  next();
});

// Middleware to filter inactive users from all find queries - queries that start with 'find'.
userSchema.pre(/^find/, function (next) {
  // This is query middleware so 'this' points to query object.
  this.find({ active: { $ne: false } });
  next();
});

// ===================
// Instance methods
// ===================
// Method to check the password for login
userSchema.methods.verifyPassword = async function (candidatePassword) {
  // Note - Since the password field has schema type 'select: false', when you fetch document from DB, the mongoose doc will not contain 'password' field by default and as a result, it will not be available inside instance methods via 'this.password'. So, make sure you select the password when you fetch user using select('+password') query and then you can access password in instance methods via 'this.password'.
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if password was changed after token was issued.
userSchema.methods.isPasswordChanged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    // Convert passwordChangedAt to seconds because JWT issued at timestamp is in seconds.
    const passwordChangedAtTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );
    return JWTTimestamp < passwordChangedAtTimestamp;
  }
  return false;
};

// Method to create password reset token for user.
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  // If we store reset token as it is in DB, if DB data is leaked, attacker can use reset token to reset the password and get access to account. So just like password, we should store it by encrypting.
  // It is not necessary to use strong encryption for reset tokens.
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // Set expiration time of reset token - 10 mins
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
