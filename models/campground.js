const mongoose = require("mongoose");
const opts = { toJSON: { virtuals: true } };
const Review = require("./review.js");
const imageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
const campgroundSchema = new mongoose.Schema(
  {
    title: String,
    images: [imageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong> <a href = "/campgrounds/${this.id}">${this.title}</a> <strong>
  `;
});
//Mongoose Middleware for Deleting all reviews associated with a campground
campgroundSchema.post("findOneAndDelete", async function (campground) {
  if (campground.reviews.length) {
    //removes all reviews whose ids is in campground.reviews
    await Review.deleteMany({ _id: { $in: campground.reviews } });
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
