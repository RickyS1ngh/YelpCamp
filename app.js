//If in not production mode, require dotenv package
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("./models/user");

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

const dbUrl = process.env.DB_URL;
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Database connected"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); //sets view directory to the views folder where app.js is located
app.use(express.static(path.join(__dirname, "public"))); //serving our static assets
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true })); //decodes form data
app.use(methodOverride("_method"));
const sessionConfig = {
  name: "session",
  secret: "thisisasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //sets the coookie to expire a week from today
    maxAge: 60 * 60 * 24 * 7, //max age of a week
  },
};
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
app.use(session(sessionConfig));
// Define the allowed sources for different content types
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
  "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js", // Popper.js CDN URL
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js", // Bootstrap.js CDN URL
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/", // Add jsDelivr for stylesheets
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];

// Use Helmet to set the CSP headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      styleSrcElem: ["'self'", ...styleSrcUrls], // Ensure style-src-elem includes the same as style-src
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dta1x2ack/",
        "https://images.unsplash.com/", // Example domain allowed for images
        "https://example.com/", // Add the domain where your images are hosted
        "https://another-domain.com/", // Add additional domains as needed
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use(flash());

app.use(passport.initialize()); //initalizes passport
app.use(passport.session()); //persistent login
passport.use(new passportLocal(User.authenticate())); //passport should use the local strategy and for that stratgey use the authenicate method
passport.serializeUser(User.serializeUser()); //how a user is stored in a session
passport.deserializeUser(User.deserializeUser()); //how user is deleted in a session

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use("/campgrounds", campgroundRoutes); //uses all the campgroundRoutes defined and prefixes them
app.use("/campgrounds/:id/reviews", reviewRoutes); //uses all the campgroundRoutes defined and prefixes them
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home");
});
// An error occurs when a user tries to access an invalid route in any type of request
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});
// Error Handler
app.use((err, req, res, next) => {
  //sets defualt value for message if it doesn't exist
  const { statusCode = 500 } = err;
  console.log(err);
  if (!err.message) {
    err.message = "Error occured";
  }
  res.status(statusCode).render("error", { err });
});
app.listen(3000, () => {
  console.log("Listening on Port 3000");
});
