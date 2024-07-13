const { validate } = require("./models/review");
const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");
//middleware that checks if user is logged in when trying to accerss a route
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnUrl = req.originalUrl; //stores the url that user was trying to visit before sent to login page
    req.flash("error", "You must sign in!");
    return res.redirect("/login");
  }
  next();
};
const storeReturnUrl = (req, res, next) => {
  if (req.session.returnUrl) {
    res.locals.returnUrl = req.session.returnUrl;
  }
  next();
};
//Function is called when a campground is created or saved to check if it is valid
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};
//middleware to check if the user is the author of the campground
const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  //if campground is empty, set a flash
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
const isReviewAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};
module.exports = {
  isLoggedIn,
  storeReturnUrl,
  validateCampground,
  isAuthor,
  validateReview,
  isReviewAuthor,
};
