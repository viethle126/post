var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  user: String,
  hash: String,
  session: String,
  posts: { type: Number, default: 0 },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  saves: { type: Number, default: 0 }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
