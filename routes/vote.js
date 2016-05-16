var router = require('express').Router();
// mongoose
var Comment = require('../models/comment');
var Post = require('../models/post');

// add vote to post
router.put('/post', function(req, res) {
  Post.findOne({ _id: req.body.post_id }, function(error, post) {
    if (error) {
      res.json({ info: 'Error during find post' });
      return;
    }

    if (post === null) {
      res.json({ info: 'Could not find post' });
      return;
    }

    if (post[req.body.type].indexOf(req.currentUser.toString()) === -1) {
      post[req.body.type].push(req.currentUser.toString());
      post.save(function(error) {
        if (error) {
          res.json({ info: 'Error during update post', error: error });
          return;
        }
        res.status(200).json({ info: 'Vote added successfully' });
      })
    } else {
      res.status(200).json({ info: 'Duplicate vote was not added' });
    }
  })
})
// add vote to comment
router.put('/comment', function(req, res) {
  Comment.findOne({ _id: req.body.post_id }, function(error, comment) {
    if (error) {
      res.json({ info: 'Error during find comment' });
      return;
    }

    if (comment === null) {
      res.json({ info: 'Could not find comment' });
      return;
    }

    if (comment[req.body.type].indexOf(req.currentUser.toString()) === -1) {
      comment[req.body.type].push(req.currentUser.toString());
      comment.save(function(error) {
        if (error) {
          res.json({ info: 'Error during update comment', error: error });
          return;
        }
        res.status(200).json({ info: 'Vote added successfully' });
      })
    } else {
      res.status(200).json({ info: 'Duplicate vote was not added' });
    }
  })
})
// clear votes, post
router.delete('/post', function(req, res) {
  Post.findOne({ _id: req.body.post_id }, function(error, post) {
    if (error) {
      res.json({ info: 'Error during find post' });
      return;
    }
    if (post === null) {
      res.json({ info: 'Could not find post' });
      return;
    }
    var up = post.upvotes.indexOf(req.currentUser.toString());
    var down = post.downvotes.indexOf(req.currentUser.toString());
    if (up !== -1) {
      post.upvotes.splice(up, 1);
    }

    if (down !== -1) {
      post.downvotes.splice(down, 1);
    }

    post.save(function(error) {
      if (error) {
        res.json({ info: 'Error during update post', error: error });
        return;
      }
      res.status(200).json({ info: 'Vote cleared successfully' });
    })
  })
})
// clear votes, comment
router.delete('/comment', function(req, res) {
  Comment.findOne({ _id: req.body.post_id }, function(error, comment) {
    if (error) {
      res.json({ info: 'Error during find comment' });
      return;
    }
    if (comment === null) {
      res.json({ info: 'Could not find comment' });
      return;
    }
    var up = comment.upvotes.indexOf(req.currentUser.toString());
    var down = comment.downvotes.indexOf(req.currentUser.toString());
    if (up !== -1) {
      comment.upvotes.splice(up, 1);
    }

    if (down !== -1) {
      comment.downvotes.splice(down, 1);
    }

    comment.save(function(error) {
      if (error) {
        res.json({ info: 'Error during update comment', error: error });
        return;
      }
      res.status(200).json({ info: 'Vote cleared successfully' });
    })
  })
})

module.exports = router;
