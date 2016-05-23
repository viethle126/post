var router = require('express').Router();
// mongoose
var User = require('../models/user');

function verify(req, res, next) {
  if (req.cookies.user && req.cookies.session) {
    User.findOne({ user: req.cookies.user, session: req.cookies.session },
    function(error, results) {
      if (error) {
        res.json({ info: 'Error during find user', error: error });
        return;
      }

      if (results === null) {
        next();
        return;
      }

      req.currentUser = results._id;
      next();
    })
  } else {
    next();
  }
}

router.use(verify);

module.exports = router;
