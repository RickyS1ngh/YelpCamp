const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utils/asyncWrapper");
const User = require("../models/user");
const passport = require("passport");
const { storeReturnUrl } = require("../middleware");
const {
  registerForm,
  createUser,
  loginForm,
  logout,
  login,
} = require("../controllers/users");

router
  .route("/register")
  //Gets Register form
  .get(registerForm);
//Creates User
router.post("/register", asyncWrapper(createUser));

router
  .route("/login")
  .get(loginForm)
  //Logins in user
  .post(
    storeReturnUrl,
    //middleware that authenicates the login credientals
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    login
  );

router.get("/logout", logout);
module.exports = router;
