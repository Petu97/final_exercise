const express = require("express");
var userRouter = express.Router();
const User = require("../models/users");
const passport = require("passport");

//express bodyparser
userRouter.use(express.json());
userRouter.use(express.urlencoded({ extended: true }));

//return signup page to user
userRouter.get("/signup", (req, res) => {
  res.render("signup.ejs");
});
//create account
userRouter.post("/signup", (req, res) => {
  User.create({ name: req.body.username, password: req.body.password })
    .then(() => {
      res.render("login.ejs");
    })
    .catch((err) => {
      console.log(err);
      res.render("signup.ejs");
    });
});
//return login page to user
userRouter.get("/login", (req, res) => {
  res.render("login.ejs");
});

//user login
userRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/fakkit/topics",
    failureRedirect: "/users/login",
  })
);

//User Logout
userRouter.get("/logout", (req, res, next) => {
  if (req.session) {
    // destroy session
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/users/login");
  } else {
    // user is not logged in
    var err = new Error("You are not logged in!");
    next(err);
  }
});

module.exports = userRouter;
