var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  user: String,
  user_id: String,
  post_id: String,
  reply_to: String,
  date: Date,
  comment: String,
  upvotes: { type: Array, default: [] },
  downvotes: { type: Array, default: [] }
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
