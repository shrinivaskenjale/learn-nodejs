const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

// Aliasing a route
// We add query parameters using middleware.
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopCheapTours, tourController.getAllTours);

// router.route("/tour-stats").get(tourController.getTourStats);
// router
//   .route("/monthly-plan/:year")
//   .get(
//     authController.protect,
//     authController.restrictTo("admin", "lead-guide", "guide"),
//     tourController.getMonthlyPlan
//   );

router.route("/").get(tourController.getAllTours).post(
  // authController.protect,
  // authController.restrictTo("admin", "lead-guide"),
  tourController.createTour
);

router
  .route("/:id")
  .get(tourController.getOneTour)
  .patch(
    // authController.protect,
    // authController.restrictTo("admin", "lead-guide"),
    tourController.updateTour
  )
  .delete(
    // authController.protect,
    // authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

/**
 * Nested routes make sense when there is parent-child relationship between resources.
 * For example, each review is child of some tour.
 *
 * POST /tour/<tourId>/reviews => Create new review for a tour
 * GET /tour/<tourId>/reviews => Get all reviews for a tour
 * GET /tour/<tourId>/reviews/<reviewId> => Get a review for a tour
 */
// router
//   .route("/:tourId/reviews")
//   .post(
//     authController.protect,
//     authController.restrictTo("user"),
//     reviewController.createReview
//   );

router.use("/:tourId/reviews", reviewRouter);

module.exports = router;
