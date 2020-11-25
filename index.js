// setup everything...
const port = 3000;
const hostname = "localhost";
const url = "mongodb://localhost:27017/messagedb";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

const http = require("http");
const express = require("express");

const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");
const session = require("express-session");

var connect = mongoose.connect(url, options);

// create express app
var app = express();

// use cookieparser
app.use(cookieParser());
// use session with secret key
app.use(
  session({
    secret: "Very very secret!",
    resave: false,
    saveUninitialized: false,
  })
);

// require passport and our authentication setup
const passport = require("passport");
const authenticate = require("./authenticate");

// init passport
// passport session init
app.use(passport.initialize());
app.use(passport.session());

// public endpoint here before user auth?

var userRouter = require("./routes/userRouter");
app.use("/users", userRouter);

function auth(req, res, next) {
  //console.log(req.headers);
  if (req.user) {
    // is the user data included in the request?
    next();
  } else {
    var err = new Error("Not authenticated!");
    err.status = 403;
    next(err);
  }
}
// Use the authentication function before any other middleware
app.use(auth);

// get the routes and mount them
const msgRouter = require("./routes/messageRouter");

app.use("/messages", msgRouter);

// create the server
var server = http.createServer(app);

// start the server
server.listen(port, hostname, () => {
  console.log("Server started!");
});
