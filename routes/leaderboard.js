var router = require('express').Router();
// mongoose
var User = require('../models/user');

router.get('/', function(req, res) {
  User.find({}).sort({score: -1}).limit(5).exec(function(error, results) {
    if (error) {
      res.json({ info: 'Error during find users', error: error });
      return;
    }

    var payload = [];

    results.forEach(function(element, index, array) {
      var user = {
        user: element.user,
        score: element.score
      }

      payload.push(user);
    })

    res.status(200).json({ info: 'Top contributors retrieved successfully', results: payload });
  })
})

module.exports = router;
