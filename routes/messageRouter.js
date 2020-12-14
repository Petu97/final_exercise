const express = require("express");
const ejs = require("ejs");
const messageRouter = express.Router();

const Messages = require("../models/messages");
messageRouter.use(express.json());
messageRouter.use(express.urlencoded({ extended: true }));

messageRouter
  .route("/main")

  .get((req, res, next) => {
    Messages.find({}).then((msgs) => {
      items = [];
      msgs.forEach((element) => {
        items.push([element.topic, element.author, element.rating]);
      });
      console.log(items);
      res.render("mainpage.ejs", { messages: items });
      items = [];
    });
  })
  .post((req, res, next) => {
    Messages.create({
      topic: req.body.topic,
      author: "placeholder",
      rating: 0,
      messageId: 1,
    })
      .then((msg) => {
        console.log(msg);
      })
      .catch((err) => next(err));
  });

messageRouter
  .route("/main/:messageId")

  .get((req, res, next) => {
    // Find given message
    Messages.findOne({ messageId: req.params.messageId })

      .then((msg) => {
        items = [msg.author, msg.topic, msg.rating];
        res.render("topic.ejs", { messages: items });
        items = [];
      })
      .catch((err) => next(err));
  })

  .delete((req, res, next) => {
    Messages.findByIdAndRemove(req.params.messageId)

      .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      })
      .catch((err) => next(err));
  });

messageRouter
  .route("/:messageId/comments")

  .get((req, res, next) => {
    Messages.findById(req.params.messageId)

      .then((msg) => {
        if (msg != null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(msg.comments);
        } else {
          // virhe!!!
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/html");
          res.end("Message not found!");
        }
      })
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    Messages.findById(req.params.messageId)
      .then((msg) => {
        if (msg != null) {
          // push new comment(s) into the message
          msg.comments.push(req.body);
          msg.save().then((msg) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(msg);
          });
        } else {
          // virhe!!!
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/html");
          res.end("Message not found!");
        }
      })
      .catch((err) => next(err));
  });

module.exports = messageRouter;
