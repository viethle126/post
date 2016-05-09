var router = require('express').Router();
var bcrypt = require('bcrypt');
// mongoose
var User = require('../models/user');

router.post('/', function(req, res) {
  User.findOne({ user: req.body.user }, function(error, results) {
    if (error) {
      res.json({ info: 'Error during find user', error: error });
      return;
    }

    if (results !== null) {
      res.status(409).json({ info: 'Name already in use' });
      return;
    }

    var saltRounds = 10;
    var password = req.body.password;

    bcrypt.hash(password, saltRounds, function(error, hash) {
      if (error) {
        res.json({ info: 'Error during generate hash', error: error });
        return;
      }

      var session = makeCookie();
      var user = new User({ user: req.body.user, hash: hash, session: session });
      user.save(function(error) {
        if (error) {
          res.json({ info: 'Error during user sign up', error: error });
          return;
        }

        res.cookie('user', req.body.user);
        res.cookie('session', session);
        res.status(200).json({ info: 'User signed up successfully' });
      })
    })
  })
})

router.get('/', function(req, res) {
  if (req.cookies.user && req.cookies.session) {
    User.findOne({ user: req.cookies.user }, function(error, results) {
      if (error) {
        res.json({ info: 'Error during find user', error: error });
        return;
      }

      var user = results;
      if (user !== null && user.session === req.cookies.session) {
        var payload = {
          user: user.user,
          posts: user.posts,
          upvotes: user.upvotes,
          downvotes: user.downvotes,
          saves: user.saves,
          score: user.score
        }
        res.send(payload);
        return;
      }

      res.send();
    })
  } else {
    res.send();
  }
})

router.post('/login', function(req, res) {
  var session = makeCookie();

  User.findOne({ user: req.body.user }, function(error, results) {
    if (error) {
      res.json({ info: 'Error during find user', error: error });
      return;
    }

    if (results === null) {
      res.status(401).json({ info: 'Invalid user/password' });
      return;
    }

    var user = results;
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
        res.status(200).json({ info: 'User logged in successfully' });
        return;
      }

      res.status(401).json({ info: 'Invalid user/password' });
    })
  })
})

router.get('/logout', function(req, res) {
  User.findOne({ user: req.cookies.user }, function(error, results) {
    if (error) {
      res.json({ info: 'Error during find user', error: error });
      return;
    }

    user = results;
    user.session = null;
    user.save(function(error) {
      if (error) {
        throw new Error(error);
      }
    })

    res.clearCookie('user');
    res.clearCookie('session');
    res.status(200).json({ info: 'User logged out successfully' });
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
