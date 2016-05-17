var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  user: String,
  user_id: String,
  date: Date,
  title: String,
  link: { type: String, default: null },
  content: { type: String, default: null },
  comments: { type: Number, default: 0 },
  upvotes: { type: Array, default: [] },
  downvotes: { type: Array, default: [] },
  saves: { type: Array, default: [] }
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;
