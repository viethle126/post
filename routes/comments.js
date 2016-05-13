var router = require('express').Router();
var addTracker = require('./posts').addTracker;
// mongoose
var Comment = require('../models/comment');

// create
router.post('/', function(req, res) {
  var comment = new Comment({
    user: req.cookies.user,
    user_id: req.currentUser,
    post_id: req.body.post_id,
    reply_to: req.body.reply,
    date: Date(),
    comment: req.body.comment
  })

  comment.save(function(error) {
    if (error) {
      res.json({ info: 'Error during create new comment', error: error });
      return;
    }

    res.status(200).json({ info: 'Comment submitted successfully' });
  })
})
// read
router.get('/:post_id', function(req, res) {
  Comment.find({ post_id: req.params.post_id }).lean().exec(function(error, results) {
    if (error) {
      res.json({ info: 'Error during find comments', error: error });
    }

    res.status(200).json({ info: 'Comments retrieved successfully', results: addTracker(req, results) });
  })
})
// update
router.put('/', function(req, res) {
  Comment.findOne({ _id: req.body.comment_id, user_id: req.currentUser }, function(error, comment) {
    if (error) {
      res.json({ info: 'Error during find comment', error: error });
      return;
    }

    if (comment === null) {
      res.json({ info: 'Could not find comment' });
      return;
    }

    comment.date = Date();
    comment.comment = req.body.comment;

    comment.save(function(error) {
      if (error) {
        res.json({ info: 'Error during update comment', error: error });
        return;
      }

      res.status(200).json({ info: 'Comment updated successfully' });
    })
  })
})
// delete
router.delete('/', function(req, res) {
  Comment.findOne({ _id: req.body.comment_id, user_id: req.currentUser }, function(error, comment) {
    if (error) {
      res.json({ info: 'Error during find comment' });
      return;
    }

    if (comment === null) {
      res.json({ info: 'Could not find comment' });
      return;
    }

    comment.remove(function(error) {
      if (error) {
        res.json({ info: 'Error during delete comment' });
        return;
      }
    })

    res.status(200).json({ info: 'Comment deleted successfully' });
  })
})

module.exports = router;
