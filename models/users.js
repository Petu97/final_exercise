const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});

var User = mongoose.model("User", userSchema);

module.exports = User;
