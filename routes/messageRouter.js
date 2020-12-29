const express = require("express");
const ejs = require("ejs");
const messageRouter = express.Router();

const passportSessionCheck = require("../passportSessionCheck");
const Messages = require("../models/messages");
const users = require("../models/users");
messageRouter.use(express.json());
messageRouter.use(express.urlencoded({ extended: true }));

// var indexNumber = Messages.countDocuments({});
// console.log(indexNumber);

messageRouter
  .route("/topics")

  .get((req, res, next) => {
    Messages.find({}).then((msgs) => {
      items = [];
      msgs.forEach((element) => {
        items.push([
          element.topic,
          element.author,
          element.rating,
          element.messageId,
        ]);
      });
      res.render("mainpage.ejs", { messages: items });
      items = [];
    });
  })
  //Post a new message
  .post(passportSessionCheck, (req, res, next) => {
    Messages.estimatedDocumentCount()
      .then((count) => {
        Messages.create({
          topic: req.body.topic,
          author: req.user.name,
          rating: 0,
          messageId: count,
        })
          .then(() => {
            res.redirect("/fakkit/topics");
          })
          .catch((err) => next(err));
      })
      .catch((err) => {
        console.log(err);
      });
  });
//Individual topics
messageRouter
  .route("/topics/:messageId/")
  // Find given message
  .get((req, res, next) => {
    Messages.findOne({ messageId: req.params.messageId })
      .then((msg) => {
        if (msg !== null) {
          basicTopicInfo = [msg.author, msg.topic, msg.rating];
          topicComments = [];
          msg.comments.forEach((element) => {
            topicComments.push(element.message, element.author, element.rating);
          });
          res.render("topic.ejs", {
            topicId: msg.messageId,
            topicInfo: basicTopicInfo,
            comments: msg.comments,
          });
          topicComments = [];
          basicTopicInfo = [];
        } else
          res.render("error.ejs", {
            message: "Could not find a topic under given id",
          });
      })
      .catch((err) => {
        res.render("error.ejs", {
          message: "Invalid id: id has to be a number value",
        });
      });
  })
  //add comment
  .post(passportSessionCheck, (req, res, next) => {
    console.log("Post was ran");
    Messages.findOne({ messageId: req.params.messageId })
      .then((msg) => {
        msg.comments.push({
          message: req.body.comment,
          author: req.user.name,
          rating: 0,
        });
        msg
          .save()
          .then((msg) => {})
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .delete(passportSessionCheck, (req, res, next) => {
    Messages.findByIdAndRemove({ messageId: req.params.messageId })
      .then((msg) => {
        console.log(msg);
      })
      .catch((err) => next(err));
  });
//Like
messageRouter
  .route("/topics/:messageId/like")
  .post(passportSessionCheck, (req, res) => {
    like(req, res, 1, "topic", req.params.messageId);
  });
//Dislike
messageRouter
  .route("/topics/:messageId/dislike")
  .post(passportSessionCheck, (req, res) => {
    like(req, res, -1, "topic", req.params.messageId);
  });

messageRouter
  .route("/topics/:messageId/:commentId/like")
  .post(passportSessionCheck, (req, res) => {
    like(req, res, 1, "comment", req.params.messageId, req.params.commentId);
  });

function like(req, res, value, type, id, cid) {
  if (type === "topic") {
    Messages.findOneAndUpdate({ messageId: id }, { $inc: { rating: value } })
      .then(() => {
        res.redirect("back");
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (type === "comment") {
    Messages.findOneAndUpdate(
      { messageId: id, "commets.indexOf()": cid },
      { $inc: { rating: value } }
    )
      .then((obj) => {
        console.log(obj);
        res.redirect("back");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

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
    Messages.findOne({ messageId: req.params.messageId })
      .then((msg) => {
        console.log("messageid was found");
        msg.comments.push({
          message: req.body.comment,
          author: "placeholder",
          rating: 0,
          commentid: 1,
        });
        msg
          .save()
          .then((msg) => {
            console.log("Success!");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });

module.exports = messageRouter;
