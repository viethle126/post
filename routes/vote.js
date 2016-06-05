var router = require('express').Router();
// mongoose
var User = require('../models/user');
var Post = require('../models/post');
var Comment = require('../models/comment');

function handleVote(doc, type, user) {
  if (doc[type].indexOf(user) !== -1) {
    res.status(200).json({ info: 'Duplicate vote was not added' });
    return;
  } else {
    doc[type].push(user);

    if (type === 'upvotes') {
      doc.score++;
    }

    if (type === 'downvotes') {
      doc.score--;
    }

    return doc;
  }
}

function updateUser(user_id, type, res) {
  User.findOne({ _id: user_id }, function(error, user) {
    if (error) {
      res.json({ info: 'Error during find user', error: error });
    }

    if (user === null) {
      res.status(200).json({ info: 'Vote added successfully' });
      return;
    }

    if (type === 'upvotes') {
      user.upvotes++;
      user.score++;
    }

    if (type === 'downvotes') {
      user.downvotes++;
      user.score--;
    }

    user.save(function(error) {
      if (error) {
        res.json({ info: 'Error during update user upvote count', error: error });
      }

      res.status(200).json({ info: 'Vote added successfully' });
    });
  });
}

function configure(doc, user) {
  var upvote = doc.upvotes.indexOf(user);
  var downvote = doc.downvotes.indexOf(user);
  var config = {};

  if (upvote !== -1) {
    config.type = 'upvotes';
    config.index = upvote;
  }

  if (downvote !== -1) {
    config.type = 'downvotes';
    config.index = downvote;
  }

  return config;
}

function clearVotes(doc, user, config) {
  doc[config.type].splice(config.index, 1);

  if (config.type === 'upvotes') {
    doc.score--;
    return doc;
  }

  if (config.type === 'downvotes') {
    doc.score++;
    return doc;
  }
}

function clearUser(user_id, config, res) {
  User.findOne({ _id: user_id }, function(error, user) {
    if (error) {
      res.json({ info: 'Error during find user', error: error });
    }

    if (user === null) {
      res.status(200).json({ info: 'Vote cleared successfully' });
      return;
    }

    if (config.type === 'upvotes') {
      user.upvotes--;
      user.score--;
    }

    if (config.type === 'downvotes') {
      user.downvotes--;
      user.score++;
    }

    user.save(function(error) {
      if (error) {
        res.json({ info: 'Error during update user upvote count', error: error });
      }

      res.status(200).json({ info: 'Vote cleared successfully' });
    });
  });
}

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

    post = handleVote(post, req.body.type, req.currentUser.toString(), res);

    post.save(function(error) {
      if (error) {
        res.json({ info: 'Error during update post', error: error });
        return;
      }

      updateUser(post.user_id, req.body.type, res);
    });
  });
});
// add vote to comment
router.put('/comment', function(req, res) {
  Comment.findOne({ _id: req.body.comment_id }, function(error, comment) {
    if (error) {
      res.json({ info: 'Error during find comment' });
      return;
    }

    if (comment === null) {
      res.json({ info: 'Could not find comment' });
      return;
    }

    comment = handleVote(comment, req.body.type, req.currentUser.toString(), res);

    comment.save(function(error) {
      if (error) {
        res.json({ info: 'Error during update comment', error: error });
        return;
      }

      updateUser(comment.user_id, req.body.type, res);
    });
  });
});
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

    var config = configure(post, req.currentUser.toString());

    if (config.type) {
      post = clearVotes(post, req.currentUser.toString(), config);
    }

    post.save(function(error) {
      if (error) {
        res.json({ info: 'Error during update post', error: error });
        return;
      }

      clearUser(post.user_id, config, res);
    });
  });
});
// clear votes, comment
router.delete('/comment', function(req, res) {
  Comment.findOne({ _id: req.body.comment_id }, function(error, comment) {
    if (error) {
      res.json({ info: 'Error during find comment' });
      return;
    }

    if (comment === null) {
      res.json({ info: 'Could not find comment' });
      return;
    }

    var config = configure(comment, req.currentUser.toString());

    if (config.type) {
      comment = clearVotes(comment, req.currentUser.toString(), config);
    }

    comment.save(function(error) {
      if (error) {
        res.json({ info: 'Error during update comment', error: error });
        return;
      }

      clearUser(comment.user_id, config, res);
    });
  });
});

module.exports = router;
