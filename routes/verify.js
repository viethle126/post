var router = require('express').Router();
// mongoose
var User = require('../models/user');

// determine current user
function verify(req, res, next) {
  if (req.cookies.user && req.cookies.session) {
    User.findOne({ user: req.cookies.user, session: req.cookies.session },
    function(error, user) {
      if (error) {
        res.json({ info: 'Error during find user', error: error });
        return;
      }

      if (user === null) {
        next();
        return;
      }

      req.currentUser = user._id;
      next();
    });
  } else {
    next();
  }
}

router.use(verify);

module.exports = router;
