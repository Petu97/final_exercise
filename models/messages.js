const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    message: {
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
    id: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const messageSchema = new Schema(
  {
    topic: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    messageId: {
      type: Number,
      required: true,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

var Messages = mongoose.model("Message", messageSchema);

module.exports = Messages;
