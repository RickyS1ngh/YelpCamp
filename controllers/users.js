const User = require("../models/user");
const registerForm = (req, res) => {
  res.render("users/register");
};
const createUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password); //hashes password
    //logins in the user after they have registered
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to YelpCamp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};
const loginForm = (req, res) => {
  res.render("users/login");
};

const login = (req, res) => {
  const returnUrl = res.locals.returnUrl || "/campgrounds";
  req.flash("success", "Welcome Back!");
  res.redirect(returnUrl);
};
const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.flash("success", "Logged Out Successfully!");
    res.redirect("/campgrounds");
  });
};
module.exports = { registerForm, createUser, loginForm, login, logout };
