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
        res.status(401).json({ info: 'You must be logged in to do that' });
        return;
      }

      next();
    })
  } else {
    res.status(401).json({ info: 'You must be logged in to do that' });
  }
}

router.use(verify);

module.exports = router;
