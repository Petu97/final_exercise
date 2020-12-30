const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

const msgRouter = require("./routes/messageRouter");
const userRouter = require("./routes/userRouter");
//const authenticate = require("./authenticate");

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
var app = express();
//mongoose connection
mongoose.connect("mongodb://localhost:27017/messagedb", options);

app.use(cookieParser()); // use cookieparser
app.use(
  session({
    secret: "Very very secret!",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize()); // init passport
app.use(passport.session()); // passport session init
app.use("/users", userRouter); //userRouter
app.use("/fakkit", msgRouter); //messageRouter

// start the server
app.listen("8080", "localhost", () => {
  console.log("Listening on port 8080");
});
