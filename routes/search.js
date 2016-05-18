var router = require('express').Router();
var addTracker = require('./posts').addTracker;
var isSaved = require('./posts').isSaved;
// mongoose
var Post = require('../models/post');

router.get('/', function(req, res) {
  Post.find({}).lean().exec(function(error, results) {
    if (error) {
      res.json({ info: 'Error during find posts', error: error });
      return;
    }

    var payload = [];
    var search = new RegExp(req.query.query, 'i');

    results.forEach(function(element, index, array) {
      if (element.title.match(search) !== null) {
        payload.push(element);
      }
    })

    if (req.currentUser) {
      isSaved(req, payload);
      addTracker(req, payload);
    }

    res.status(200).json({ info: 'Search results retrieved successfully', results: payload });
  })
})

module.exports = router;
