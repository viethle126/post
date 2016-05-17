var router = require('express').Router();
var forbid = require('./forbid');
// mongoose
var Post = require('../models/post');

// create
router.post('/', forbid, function(req, res) {
  var post = new Post({
    user: req.cookies.user,
    user_id: req.currentUser,
    date: Date(),
    title: req.body.title,
    link: req.body.link,
    content: req.body.content
  })

  post.save(function(error) {
    if (error) {
      res.json({ info: 'Error during create new post', error: error });
      return;
    }

    res.status(200).json({ info: 'Post submitted successfully' });
  })
})
// read
router.get('/', function(req, res) {
  Post.find({}).lean().exec(function(error, results) {
    if (error) {
      res.json({ info: 'Error during find posts', error: error });
      return;
    }

    isSaved(req, results);

    res.status(200).json({ info: 'Posts retrieved successfully', results: addTracker(req, results) });
  })
})
// read saved
router.get('/saved', forbid, function(req, res) {
  var user = req.currentUser.toString();
  Post.find({ 'saves': user }).lean().exec(function(error, results) {
    if (error) {
      res.json({ info: 'Error during find posts', error: error });
      return;
    }

    isSaved(req, results);

    res.status(200).json({ info: 'Posts retrieved successfully', results: addTracker(req, results) });
  })
})
// read specific, for comments
router.get('/one/:post_id', function(req, res) {
  Post.find({ _id: req.params.post_id }).lean().exec(function(error, results) {
    if (error) {
      res.json({ info: 'Error during find post', error: error });
      return;
    }

    res.status(200).json({ info: 'Post retrieved successfully', results: addTracker(req, results) });
  })
})
// update
router.put('/', forbid, function(req, res) {
  Post.findOne({ _id: req.body.post_id, user_id: req.currentUser }, function(error, post) {
    if (error) {
      res.json({ info: 'Error during find post', error: error });
      return;
    }

    if (post === null) {
      res.json({ info: 'Could not find post' });
      return;
    }

    post.date = Date();
    if (req.body.title) { post.title = req.body.title }
    if (req.body.link) { post.link = req.body.link }
    if (req.body.content) { post.content = req.body.content }

    post.save(function(error) {
      if (error) {
        res.json({ info: 'Error during update post', error: error });
        return;
      }

      res.status(200).json({ info: 'Post updated successfully' });
    })
  })
})
// delete
router.delete('/', forbid, function(req, res) {
  Post.findOne({ _id: req.body.post_id, user_id: req.currentUser }, function(error, post) {
    if (error) {
      res.json({ info: 'Error during find post' });
      return;
    }

    if (post === null) {
      res.json({ info: 'Could not find post' });
      return;
    }

    post.remove(function(error) {
      if (error) {
        res.json({ info: 'Error during delete post' });
        return;
      }
    })

    res.status(200).json({ info: 'Post deleted successfully' });
  })
})
// used to dynamically display user's upvotes/downvotes on a post
function addTracker(req, results) {
  results.forEach(function(element, index, array) {
    element.score = element.upvotes.length - element.downvotes.length;
    element.up = [element.score + 1, element.score];
    element.down = [element.score - 1, element.score];
    element.state = 'neutral';

    if (!req.currentUser) {
      return;
    }

    if (element.upvotes.indexOf(req.currentUser.toString()) !== -1) {
      element.state = 'upvoted';
      element.up = [element.score, element.score - 1];
      element.down = [element.score - 2, element.score - 1];
      return;
    }

    if (element.downvotes.indexOf(req.currentUser.toString()) !== -1) {
      element.state = 'downvoted';
      element.up = [element.score + 2, element.score + 1];
      element.down = [element.score, element.score + 1];
      return;
    }
  })
  return results;
}

function isSaved(req, results) {
  results.forEach(function(element, index, array) {
    if (element.saves.indexOf(req.currentUser.toString()) !== -1) {
      element.isSaved = true;
      return;
    }
    element.isSaved = false;
    return;
  })

  return results;
}

module.exports = router;
module.exports.addTracker = addTracker;
