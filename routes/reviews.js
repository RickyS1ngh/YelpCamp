const express = require("express");
const router = express.Router({ mergeParams: true }); //mergeParams allows to access campground id parameter
const Review = require("../models/review");
const Campground = require("../models/campground");
const { reviewSchema } = require("../schemas");
const asyncWrapper = require("../utils/asyncWrapper");
const ExpressError = require("../utils/ExpressError");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const { createReview, deleteReview } = require("../controllers/reviews");

//Creates New Review
router.post("/", isLoggedIn, validateReview, asyncWrapper(createReview));
//Delete a Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  asyncWrapper(deleteReview)
);

module.exports = router;
