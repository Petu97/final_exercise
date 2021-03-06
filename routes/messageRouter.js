const express = require("express");
const messageRouter = express.Router();

const passportSessionCheck = require("../passportSessionCheck");
const Messages = require("../models/messages");

//express bodyparser
messageRouter.use(express.json());
messageRouter.use(express.urlencoded({ extended: true }));

messageRouter
  .route("/topics")
  //get the main page
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
      //sends ech topic to user
      res.render("mainpage.ejs", { messages: items });
      items = [];
    });
  })
  //Post a new topic
  .post(passportSessionCheck, (req, res, next) => {
    Messages.estimatedDocumentCount()
      .then((count) => {
        Messages.create({
          topic: req.body.topic,
          author: req.user.name,
          rating: 0,
          messageId: count, //the number of items in collection works as an "id"
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

messageRouter
  .route("/topics/:messageId/")
  //get an individual topic by id
  .get((req, res, next) => {
    Messages.findOne({ messageId: req.params.messageId })
      .then((msg) => {
        if (msg !== null) {
          //splits message object to 3 parts to make it easier to read, and sends them to the client
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
  //add comment to a topic
  .post(passportSessionCheck, (req, res, next) => {
    Messages.findOne({ messageId: req.params.messageId })
      .then((msg) => {
        msg.comments.push({
          message: req.body.comment,
          author: req.user.name,
          rating: 0,
          id: msg.comments.length,
        });
        msg
          .save()
          .then(() => {
            res.redirect("back");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  })
  //experimental delete request
  .delete(passportSessionCheck, (req, res, next) => {
    //"Removes" topic (reddit does not actually delete comments, only renders them empty)
    Messages.findOneAndUpdate(
      { messageId: req.params.messageId },
      { topic: "DELETED" }
    )
      .then((msg) => {
        res.render("back");
      })
      .catch((err) => next(err));
  })
  //experimental put request
  .put(passportSessionCheck, (req, res, next) => {
    Messages.findOneAndUpdate({
      messageId: req.params.messageId,
      topic: req.body.newtopic,
      author: req.user.name,
    }).then((msg) => {});
  });
//Topic like
messageRouter
  .route("/topics/:messageId/like")
  .post(passportSessionCheck, (req, res) => {
    like(req, res, 1, "topic", req.params.messageId);
  });
//Topic dislike
messageRouter
  .route("/topics/:messageId/dislike")
  .post(passportSessionCheck, (req, res) => {
    like(req, res, -1, "topic", req.params.messageId);
  });
//Comment like
messageRouter
  .route("/topics/:messageId/:commentId/like")
  .post(passportSessionCheck, (req, res) => {
    like(req, res, 1, "comment", req.params.messageId, req.params.commentId);
  });
//comment dislike
messageRouter
  .route("/topics/:messageId/:commentId/dislike")
  .post(passportSessionCheck, (req, res) => {
    like(req, res, -1, "comment", req.params.messageId, req.params.commentId);
  });

//req, res, value = (-1 or +1), type (commnet/message), Message id, Comment id
function like(req, res, value, type, mId, cId) {
  if (type === "topic") {
    //increases or decreases topic rating score depending on value
    Messages.findOneAndUpdate({ messageId: mId }, { $inc: { rating: value } })
      .then(() => {
        res.redirect("back");
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (type === "comment") {
    Messages.findOneAndUpdate(
      { messageId: mId, "comments.id": cId },
      { $inc: { "comments.$.rating": value } }
    )
      .then((obj) => {
        res.redirect("back");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = messageRouter;
