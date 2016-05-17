var router = require('express').Router();

function forbid(req, res, next) {
  if (!req.currentUser) {
    res.status(401).json({ info: 'You must be logged in to do that' });
    return;
  }
  next();
}

router.use(forbid);

module.exports = router;
