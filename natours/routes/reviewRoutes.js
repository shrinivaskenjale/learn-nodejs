const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });
// Since we want access to :tourId path parameter, we need to set mergeParams option to true.

// Protect all the routes
router.use(authController.protect);

router
  .route("/")
  .get(reviewController.setTourId, reviewController.getAllReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  );

module.exports = router;
