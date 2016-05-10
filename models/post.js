var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  user: String,
  user_id: String,
  date: Date,
  title: String,
  link: { type: String, default: null },
  content: { type: String, default: null }
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;
