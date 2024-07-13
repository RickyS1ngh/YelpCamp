const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas");
const asyncWrapper = require("../utils/asyncWrapper");
const ExpressError = require("../utils/ExpressError");
const campground = require("../models/campground");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const {
  index,
  newForm,
  createCampground,
  showCampground,
  editForm,
  updateCampground,
  deleteCampground,
} = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const app = express();

router
  .route("/")
  //Renders All Campground Page
  .get(asyncWrapper(index))
  //Creates new campground
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    asyncWrapper(createCampground)
  );

//Form to create new campground
router.get("/new", isLoggedIn, newForm);

router
  .route("/:id")
  //Gets Show page for the indivdual campground
  .get(asyncWrapper(showCampground))
  //Updates Campground
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    asyncWrapper(updateCampground)
  )
  //Deletes Campground
  .delete(isLoggedIn, asyncWrapper(deleteCampground));
//Form to update campground
router.get("/:id/edit", isLoggedIn, isAuthor, asyncWrapper(editForm));

module.exports = router; //exports the campground routes
