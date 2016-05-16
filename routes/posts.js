var router = require('express').Router();
var verify = require('./verify');
// mongoose
var Post = require('../models/post');

// create
router.post('/', verify, function(req, res) {
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

    res.status(200).json({ info: 'Posts retrieved successfully', results: addTracker(req, results) });
  })
})
// read saved
router.get('/saved', verify, function(req, res) {
  var user = req.currentUser.toString();
  Post.find({ 'saves': user }).lean().exec(function(error, results) {
    if (error) {
      res.json({ info: 'Error during find posts', error: error });
      return;
    }

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
router.put('/', verify, function(req, res) {
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
router.delete('/', verify, function(req, res) {
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
    element.change = 0;

    if (!req.currentUser) {
      return element.value = 0;
    }

    if (element.upvotes.indexOf(req.currentUser.toString()) !== -1) {
      return element.value = 1;
    }

    if (element.downvotes.indexOf(req.currentUser.toString()) !== -1) {
      return element.value = -1;
    }

    return element.value = 0;
  })

  return results;
}

module.exports = router;
module.exports.addTracker = addTracker;
