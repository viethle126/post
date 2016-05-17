var express = require('express');
var app = express();
// middleware
var jsonParser = require('body-parser').json();
var cookieParser = require('cookie-parser')();
// routes
var user = require('./routes/user');
var posts = require('./routes/posts');
var comments = require('./routes/comments');
var search = require('./routes/search');
var vote = require('./routes/vote');
var save = require('./routes/save');
var verify = require('./routes/verify');
var forbid = require('./routes/forbid');
// mongoose
var mongoose = require('mongoose');
var options = {
  server: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS : 30000
    }
  }
};
mongoose.connect(process.env.MLAB_POST_URI, options);
mongoose.connection.on('error', console.error.bind(console, 'Could not connect to MongoDB'));
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDB');
});

app.use(jsonParser, cookieParser);
app.use('/user', user);
app.use('/posts', verify, posts);
app.use('/comments', verify, comments);
app.use('/search', verify, search);
app.use('/vote', verify, forbid, vote);
app.use('/save', verify, forbid, save);
app.use(express.static('public'));

if (!require.main.loaded) {
  var port = process.env.PORT || 1337;
  var server = app.listen(port);
  console.log('Listening on port: ' + port);
}

module.exports = app;
