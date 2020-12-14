const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    messageid: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const messageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "useless",
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

var Messages = mongoose.model("Message", messageSchema);

module.exports = Messages;
