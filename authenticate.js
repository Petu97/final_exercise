var passport = require('passport');

// This is the local strategy-class
var LocalStrategy = require('passport-local').Strategy;

// This is the user schema
var User = require('./models/user');

// Tell passport to use the local strategy
//passport.use(User.createStrategy());
passport.use(new LocalStrategy(User.authenticate()));


// These are the (de-)serializiation methods
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
