var router = require('express').Router();
var bcrypt = require('bcrypt');
// mongoose
var User = require('../models/user');

router.post('/', function(req, res) {
  var saltRounds = 10;
  var password = req.body.password;

  bcrypt.hash(password, saltRounds, function(error, hash) {
    if (error) {
      res.json({ info: 'Error during generate hash', error: error });
      return;
    }
    var data = {
      user: req.body.user,
      hash: hash,
    }
    var user = new User(data);
    user.save(function(error) {
      if (error) {
        res.json({ info: 'Error during user sign up', error: error });
        return;
      }
      res.json({ info: 'User signed up successfully'});
    })
  })
})

module.exports = router;
