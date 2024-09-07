const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllUsers = factory.getAll(User);

// Middleware adds current user's id in params object so that /me route then call getUser middleware.
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Don't allow user to update password.
  // Use different route for updating password.
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates.", 400));
  }

  // 2. Update the user.
  // Extract the fields from body you should update. Don't use body directly to update the user.
  // Option 1
  // const { name, email } = req.body;
  // const user = await User.findById(req.user.id);
  // user.name = name || user.name;
  // user.email = email || user.email;
  // await user.save({
  //   validateModifiedOnly: true,
  // });

  // Option 2
  // Filter out unwanted fields from body.
  const filteredBody = filterBody(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

// When user deletes himself
exports.deleteMe = catchAsync(async (req, res, next) => {
  // Set active field to false.
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getUser = factory.getOne(User);

// When admin deletes someone
exports.deleteUser = factory.deleteOne(User);

// Do not update password with this
exports.updateUser = factory.updateOne(User);

function filterBody(body, ...allowed) {
  const filteredBody = {};
  for (const key in body) {
    if (allowed.includes(key)) {
      filteredBody[key] = body[key];
    }
  }
  return filteredBody;
}
