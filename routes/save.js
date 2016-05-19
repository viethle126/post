var router = require('express').Router();
// mongoose
var User = require('../models/user');
var Post = require('../models/post');

// add to saved
router.put('/', function(req, res) {
  Post.findOne({ _id: req.body.post_id }, function(error, post) {
    if (error) {
      res.json({ info: 'Error during find post' });
      return;
    }

    if (post === null) {
      res.json({ info: 'Could not find post' });
      return;
    }

    if (post.saves.indexOf(req.currentUser.toString()) === -1) {
      post.saves.push(req.currentUser.toString());
      post.save(function(error) {
        if (error) {
          res.json({ info: 'Error during update post', error: error });
          return;
        }

        User.findOne({ _id: post.user_id }, function(error, user) {
          if (error) {
            res.json({ info: 'Error during find user', error: error });
          }

          user.saves++;

          user.save(function(error) {
            if (error) {
              res.json({ info: 'Error during update user save count', error: error });
            }

            res.status(200).json({ info: 'Post added to saved' });
          })
        })
      })
    } else {
      res.status(200).json({ info: 'Post is already in saved' });
    }
  })
})
// remove from saved
router.delete('/', function(req, res) {
  Post.findOne({ _id: req.body.post_id }, function(error, post) {
    if (error) {
      res.json({ info: 'Error during find post' });
      return;
    }

    if (post === null) {
      res.json({ info: 'Could not find post' });
      return;
    }

    var index = post.saves.indexOf(req.currentUser.toString());
    post.saves.splice(index, 1);

    post.save(function(error) {
      if (error) {
        res.json({ info: 'Error during update post', error: error });
        return;
      }

      User.findOne({ _id: post.user_id }, function(error, user) {
        if (error) {
          res.json({ info: 'Error during find user', error: error });
        }

        user.saves--;

        user.save(function(error) {
          if (error) {
            res.json({ info: 'Error during update user save count', error: error });
          }

          res.status(200).json({ info: 'Post removed from saved' });
        })
      })
    })
  })
})

module.exports = router;
