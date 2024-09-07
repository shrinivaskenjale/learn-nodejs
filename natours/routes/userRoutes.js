const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// All routes coming after are protected.
router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);

router.get(
  "/me",

  userController.getMe,
  userController.getUser
);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

// All routes coming after are accessible by admin only
router.use(authController.restrictTo("admin"));
router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

module.exports = router;
