const express = require('express');
const bodyParser = require('body-parser');
const messageRouter = express.Router();

const Messages = require('../models/messages');

messageRouter.use(bodyParser.json());

// The root endpoint of our messagerouter:
// ----------------------------------------
messageRouter.route('/')

// GET
.get( (req, res, next) => {

    // Find all messages and return them as JSON
    Messages.find({}) // find every message

    .then( (msgs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(msgs);
        //res.end("GET request handled!");
    });
}
)
// POST
.post( (req, res, next) => {
    // creates a new message-object from http-body
    Messages.create(req.body)
    .then( (msg)  => {
        console.log('Message created: ' + msg);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(msg);
    })
    .catch ( (err) => next(err))
});
// PUT? (Update)

// DELETE?


// The messageId-endpoint of our messagerouter:
// ----------------------------------------
messageRouter.route('/:messageId')

// GET request
.get( (req, res, next) => {
    // Find given message
    Messages.findById(req.params.messageId) 

    .then( (msg) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(msg);
        //res.end("GET request handled!");
    })
    .catch ( (err) => next(err));
}
)

// .put 
// Messages.findByIdAndUpdate

// DEL request
.delete( (req, res, next) => {

    Messages.findByIdAndRemove(req.params.messageId)

    .then( (resp) =>  {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    })
    .catch ( (err) => next(err))
}

);

// The messageId/comments-endpoint of our messagerouter:
// ----------------------------------------
messageRouter.route('/:messageId/comments')

.get( (req, res, next) => {

    Messages.findById(req.params.messageId)

    .then( (msg) => {

        if (msg != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(msg.comments);
        }
        else {
            // virhe!!!
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end("Message not found!");
        }
    }
    )
    .catch( (err) => next(err));
}
)

// This enables to post new comments to given message
.post((req, res, next) => {
    Messages.findById(req.params.messageId)
    .then( (msg) => {
        
        if (msg != null){
            // push new comment(s) into the message
            msg.comments.push(req.body);
            msg.save()
            .then( (msg) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(msg);
            })
        }
        else {
            // virhe!!!
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end("Message not found!");
        }
    })
    .catch ( (err) => next(err));
});

/*
.put();
*/

module.exports = messageRouter;