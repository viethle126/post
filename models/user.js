var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  user: String,
  hash: String,
  session: String,
  posts: Number,
  upvotes: Number,
  downvotes: Number,
  saves: Number,
  score: Number
});

var User = mongoose.model('User', userSchema);

module.exports = User;
