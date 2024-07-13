const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary/index");
const mapBoxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mapBoxGeoCoding({ accessToken: mapBoxToken });
//Gets all Campgrounds and renders it
const index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};
const newForm = (req, res) => {
  res.render("campgrounds/new");
};
const createCampground = async (req, res, next) => {
  const geoData = await geoCoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = req.body.campground;
  const newCamp = new Campground(campground);
  newCamp.geometry = geoData.body.features[0].geometry;
  newCamp.author = req.user._id; //sets the author field by the user who created campground
  newCamp.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  })); //creates an object with url and filename and adds to campground
  await newCamp.save();
  req.flash("success", "Successfully created a new a campground!"); //Set a flash after saving new campground
  res.redirect(`/campgrounds/${newCamp._id}`);
};
const showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } }) //populates reviews and author for each review
    .populate("author");
  //if campground is empty, set a flash
  if (!campground) {
    req.flash("error", "Campground could not be found!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};
const editForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  //if campground is empty, set a flash
  if (!campground) {
    req.flash("error", "Campground could not be found!");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

const updateCampground = async (req, res) => {
  const { id } = req.params;
  const campInfo = req.body.campground;
  const campground = await Campground.findByIdAndUpdate(id, campInfo);
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs); //pushes each element onto the images array
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename); //deletes each image from cloudinary
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } }, //pulls out filename that is in the deleteImages
    });
  }
  req.flash("success", "Sucessfully updated campground");
  res.redirect(`/campgrounds/${campground._id}`);
};
const deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Sucessfully deleted campground!");
  res.redirect("/campgrounds");
};
module.exports = {
  index,
  newForm,
  createCampground,
  showCampground,
  editForm,
  updateCampground,
  deleteCampground,
};
