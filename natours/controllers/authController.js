const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

function createSendToken(user, statusCode, res) {
  const token = signToken(user._id);

  const cookieOptions = {
    // Datetime when cookie expires
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // Cookie can't be modiefied by browser
    httpOnly: true,
  };
  // Cookie should be used with HTTPS only
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  // Attach cookie to response
  res.cookie("jwt", token, cookieOptions);

  // Remove sensitive fieds from user document before sending response.
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  // Don't use request body as it is to create a user. Instead extract required fields.
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // 2. Check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    // 401 - Unauthorized
    return next(new AppError("Incorrect email or password", 401));
  }
  const isVerified = await user.verifyPassword(password, user.password);
  if (!isVerified) {
    // 401 - Unauthorized
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3. If valid, send the token to the client
  createSendToken(user, 200, res);
});

function signToken(id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
}

/**
 * In order to protect routes, we create a middleware function which executes before other handlers for that route.
 *
 * If user is not authenticated then return error else call next middleware.
 */
exports.protect = catchAsync(async (req, res, next) => {
  //
  /**
   * 1. Get token and check
   *
   * Although we client can send token using any way, common practice is to send a token using an http header with the request.
   * GET requests don't have body so we can't use body to send token.
   * Another option is query parameters but it is not standard.
   *
   * There is a standard for sending JWT tokens.
   * => Always use a header called 'authorization'.
   * => Value of the header should always start with 'Bearer', because we bear/have/possess this token.
   * => There should be single space between 'Bearer' and token, like 'Bearer <token>'.
   *
   */
  const authHeader = req.get("Authorization");
  let token;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in to get access.", 401)
    );
  }

  // 2. Verify the token
  // If token passes verification, verify method returns payload of the token, and if fails, throws an error.
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3. Check if user exists
  // It may happen that someone stole the token but that user is deleted.
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  // 4. Check if user changed password after the token was issued.
  // It may happen that someone stole the token so therefore user changed the password or user changed the password after token was issued.
  const isPasswordChanged = user.isPasswordChanged(decodedToken.iat);
  if (isPasswordChanged) {
    return next(
      new AppError(
        "User recently changed the password. Please log in again.",
        401
      )
    );
  }

  // User is authenticated. Move to next middleware.
  // Add the user object on request object.
  req.user = user;
  next();
});

// Always use protect middleware before restrictTo on route which requires authorization.
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // If role of logged in user is inside allowed roles array, then we move to next middleware.
    if (!roles.includes(req.user.role)) {
      // 403 - forbidden
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }
    // Authorized, move to next middleware.
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on provided email.
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new AppError("There is no user with provided email address.", 404)
    );
  }

  // 2. Generate random reset token.
  const resetToken = user.createPasswordResetToken();
  await user.save({
    validateModifiedOnly: true,
  });

  // 3. Send token to email id.
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}. \nIf you didn't forget your password, please ignore this email.`;
  // Sending an email can fail. If it fails, we don't just want to send error message but handle few things. So we need to handle errors here.
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
  } catch (error) {
    // If sending email fails, remove reset token and expiration time from DB for user.
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({
      validateModifiedOnly: true,
    });
    return next(
      new AppError(
        "There was an error while sending the email. Try again later.",
        500
      )
    );
  }

  res.status(200).json({
    status: "success",
    message: "Token sent to email.",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on the token which is not expired
  // In DB we have encrypted token and the one we receive is plain text.
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2. If token isn't expired and user exists, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or expired.", 400));
  }
  const { password, passwordConfirm } = req.body;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3. Update changedPasswordAt field in DB

  // 4. Log the user in and send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Although only currently logged in user can change password but we still need current password to confirm the identity because if someone gets access to application in logged in state they can change password.

  // 1. Get user from DB
  // Select password as well because we need to access password inside verifyPassword() instance method.
  const user = await User.findById(req.user.id).select("+password");

  // 2. Check if submitted password is correct
  const isCorrect = await user.verifyPassword(req.body.passwordCurrent);
  if (!isCorrect) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3. Update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // Note - We are not using findByIdAndUpdate() because we want validation (done by mongoose) and run middlewares before saving data to DB.

  // 4. Send new JWT
  createSendToken(user, 200, res);
});
