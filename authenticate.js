var passport = require("passport");

// This is the local strategy-class
var LocalStrategy = require("passport-local").Strategy;

// This is the user schema
var User = require("./models/users");

// Tell passport to use the local strategy
//passport.use(User.createStrategy());
// passport.use(new LocalStrategy(User.authenticate()));

// // These are the (de-)serializiation methods
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ name: username }, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false);
      if (user.password !== password) return done(null, false);
      return done(null, user);
    });
  })
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
