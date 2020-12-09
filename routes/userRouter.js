const express = require("express");
const User = require("../models/users");
const session = require("express-session");
const passport = require("passport");

var userRouter = express.Router();
// Use body-parser to get data from body
userRouter.use(express.json());
userRouter.use(express.urlencoded({ extended: true }));

// This router is supposed to be 'mounted' to e.g. /users
// routes

// POST for signup
// userRouter.post("/signup", (req, res, next) => {
//   console.log("Signup!");
//   // Register new user
//   User.register(
//     new User({ username: req.body.username }),
//     req.body.password,
//     (err, user) => {
//       if (err) {
//         res.statusCode = 500;
//         res.setHeader("Content-Type", "application/json");
//         res.json({ err: err });
//       } else {
//         // User registration was successful, let's authenticate the user
//         passport.authenticate("local")(req, res, () => {
//           res.statusCode = 200;
//           res.setHeader("Content-Type", "application/json");
//           res.json({ status: "Registration successful! User logged in." });
//         });
//       }
//     }
//   );
// });
userRouter.get("/signup", (req, res) => {
  res.render("signup.ejs");
});
userRouter.post("/signup", (req, res, next) => {
  User.create({ name: req.body.username, password: req.body.password })
    .then(() => {
      res.render("login.ejs");
    })
    .catch((err) => next(err));
});

userRouter.get("/login", (req, res) => {
  res.render("login.ejs");
});

userRouter.post("/login", (req, res) => {
  res.render("login.ejs");
});

// POST for login - data provided in request body (as JSON)
// remember to provide username and password

// GET for logout
userRouter.get("/logout", (req, res, next) => {
  if (req.session) {
    // user is logged in
    // destroy session
    req.session.destroy();
    console.log("Session has been destroyed!");
    // clear cookie
    res.clearCookie("session-id");
    console.log("Cookie cleared from response.");
    res.redirect("/");
  } else {
    // user is not logged in
    var err = new Error("You are not logged in!");
    next(err);
  }
});

module.exports = userRouter;
