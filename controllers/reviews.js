const Campground = require("../models/campground");
const Review = require("../models/review");

const createReview = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id; //sets author of review to current user
  campground.reviews.push(review); //pushes new review onto the campground
  await review.save();
  await campground.save();
  req.flash("success", "Created a new review!");
  res.redirect(`/campgrounds/${campground._id}`);
};
const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //pull operator removes instance of a value from an array that meet a specific condtion
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Sucessfully deleted review!");
  res.redirect(`/campgrounds/${id}`);
};
module.exports = { createReview, deleteReview };
