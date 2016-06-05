var _ = require('underscore');
var router = require('express').Router();
var forbid = require('./forbid');
var addTracker = require('./posts').addTracker;
// mongoose
var Post = require('../models/post');
var Comment = require('../models/comment');

// create comment
router.post('/', forbid, function(req, res) {
  var comment = new Comment({
    user: req.cookies.user,
    user_id: req.currentUser,
    post_id: req.body.post_id,
    reply_to: req.body.reply_to,
    date: Date(),
    comment: req.body.comment
  });

  comment.save(function(error) {
    if (error) {
      res.json({ info: 'Error during create new comment', error: error });
      return;
    }

    res.status(200).json({ info: 'Comment submitted successfully' });
  });

  Post.findOne({ _id: req.body.post_id }, function(error, post) {
    if (error) {
      throw new Error(error);
    }

    post.comments++;

    post.save(function(error) {
      if (error) {
        throw new Error(error);
      }
    });
  });
});
// get comments for a specific post
router.get('/:post_id', function(req, res) {
  Comment.find({ post_id: req.params.post_id }).lean().exec(function(error, results) {
    if (error) {
      res.json({ info: 'Error during find comments', error: error });
      return;
    }

    results = addTracker(req, results);
    results = tree(results);

    res.status(200).json({ info: 'Comments retrieved successfully', results: results });
  });
});
// update comment
router.put('/', forbid, function(req, res) {
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
    });
  });
});
// delete comment
router.delete('/', forbid, function(req, res) {
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
    });

    res.status(200).json({ info: 'Comment deleted successfully' });
  });

  Post.findOne({ _id: req.body.post_id }, function(error, post) {
    if (error) {
      throw new Error(error);
    }

    post.comments--;

    post.save(function(error) {
      if (error) {
        throw new Error(error);
      }
    });
  });
});

function tree(comments) {
  var replies = {};
  var payload = {
    count: comments.length,
    comments: []
  };

  comments.forEach(function(element, index, array) {
    if (element.reply_to !== 'post') {
      if (replies[element.reply_to]) {
        replies[element.reply_to].push(element);
        return;
      } else {
        replies[element.reply_to] = [];
        replies[element.reply_to].push(element);
        return;
      }
    }
    payload.comments.push(element);
    return;
  });

  payload.comments = _.sortBy(payload.comments, 'score').reverse();
  payload.comments.forEach(function(element, index, array) {
    branch(element, replies);
  })

  payload.comments.forEach(function(element, index, array) {
    element.thread = _.sortBy(element.thread, 'score').reverse();
  })

  return payload;
}

function branch(element, replies) {
  if (replies[element._id]) {
    element.thread = replies[element._id];
    element.thread.forEach(function(element, index, array) {
      branch(element, replies);
    });
  } else {
    return element;
  }
}

module.exports = router;
