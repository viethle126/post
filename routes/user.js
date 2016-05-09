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

    var user = new User({ user: req.body.user, hash: hash });
    user.save(function(error) {
      if (error) {
        res.json({ info: 'Error during user sign up', error: error });
        return;
      }

      res.cookie('user', req.body.user);
      res.cookie('session', makeCookie());
      res.json({ info: 'User signed up successfully' });
    })
  })
})

router.post('/login', function(req, res) {
  var session = makeCookie();

  User.find({ user: req.body.user }, function(error, results) {
    if (error) {
      res.json({ info: 'Error during find user', error: error });
      return;
    }

    var user = results[0];
    var password = req.body.password;
    var hash = user.hash;

    bcrypt.compare(password, hash, function(error, results) {
      if (results === true) {
        user.session = session;
        user.save(function(error) {
          if (error) {
            throw new Error(error);
          }
        })

        res.cookie('user', req.body.user);
        res.cookie('session', session);
        res.json({ info: 'User logged in successfully', session });
        return;
      }

      res.json({ info: 'User log in failed; Wrong password' });
    })
  })
})

router.post('/logout', function(req, res) {
  User.find({ user: req.body.user }, function(error, results) {
    if (error) {
      res.json({ info: 'Error during find user', error: error });
      return;
    }

    user = results[0];
    user.session = null;
    user.save(function(error) {
      if (error) {
        throw new Error(error);
      }
    })

    res.clearCookie('user');
    res.clearCookie('session');
    res.json({ info: 'User logged in successfully' });
  })
})

// generate session id cookie
function makeCookie() {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var cookie = '';

  while (cookie.length < 32) {
    var pick = Math.floor(Math.random() * 62);
    cookie += chars[pick];
  }
  
  return cookie;
}

module.exports = router;
