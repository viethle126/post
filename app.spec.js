var assert = require('chai').assert;
var request = require('request');
var request = request.defaults({ jar: true });
// server
var RANDOMIZE = 0;
var app = require('./app.js');
var server = app.listen(RANDOMIZE);
var port = server.address().port;
// mongoose
var mongoose = require('mongoose');
var User = require('./models/user');

describe('Create user, log in, view leaderboard', function() {
  this.timeout(0);
  this.slow(1400);

  var testUser = {
    user: 'postUserTest',
    password: 'post'
  }

  var wrongUser = {
    user: 'postUserTest',
    password: 'wrong'
  }

  var unknownUser = {
    user: 'wrongUserTest',
    password: 'wrong'
  }

  // create new user
  describe('Post request to /user', function() {
    it('is creating a new user', function(done) {
      request({
        url: 'http://localhost:' + port + '/user',
        method: 'POST',
        json: testUser
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'User signed up successfully');
        done();
      })
    })
  })
  // user name already in use
  describe('Second post request to /user', function() {
    it('is failing to create a new user', function(done) {
      request({
        url: 'http://localhost:' + port + '/user',
        method: 'POST',
        json: testUser
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 409);
        assert.equal(body.info, 'Name already in use');
        done();
      })
    })
  })
  // log in, correct credentials
  describe('Post request to /user/login with right credentials', function() {
    it('is logging in', function(done) {
      request({
        url: 'http://localhost:' + port + '/user/login',
        method: 'POST',
        json: testUser
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'User logged in successfully');
        done();
      })
    })
  })
  // log in, incorrect credentials
  describe('Post request to /user/login with wrong password', function() {
    it('is failing to log in', function(done) {
      request({
        url: 'http://localhost:' + port + '/user/login',
        method: 'POST',
        json: wrongUser
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 401);
        assert.equal(body.info, 'Invalid user/password');
        done();
      })
    })
  })
  // log in, unknown user
  describe('Post request to /user/login with unknown user', function() {
    it('is failing to log in', function(done) {
      request({
        url: 'http://localhost:' + port + '/user/login',
        method: 'POST',
        json: unknownUser
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 401);
        assert.equal(body.info, 'Invalid user/password');
        done();
      })
    })
  })
  // get leaderboard
  describe('Get request to /leaderboard', function() {
    it('is retrieving list of top contributors', function(done) {
      request({
        url: 'http://localhost:' + port + '/leaderboard',
        method: 'GET'
      }, function(error, response, body) {
        var parsed = JSON.parse(body);
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(parsed.info, 'Top contributors retrieved successfully');
        assert.notEqual(parsed.results.length, 0);
        assert.isAtMost(parsed.results.length, 5);
        done();
      })
    })
  })
})

describe('Create post, comment and replies; Upvote/downvote; Search', function() {
  this.timeout(0);
  this.slow(1400);

  var testUser = {
    user: 'postUserTest',
    password: 'post'
  }

  var newPost = {
    title: 'This is a test-generated title',
    content: 'This is test-generated content'
  }

  var editPost = {
    title: 'This is an edited title',
    content: 'This is edited content'
  }

  var newComment = {
    comment: 'This is a test-generated comment to a post',
    reply_to: 'post'
  }

  var editComment = {
    comment: 'This is an edited comment',
    reply_to: 'post'
  }

  var newReply = {
    comment: 'This is a test-generated reply to another comment'
  }

  var editReply = {
    comment: 'This is an edited reply',
  }

  // create post
  describe('Post request to /posts', function() {
    it('is creating a new post', function(done) {
      request({
        url: 'http://localhost:' + port + '/posts',
        method: 'POST',
        json: newPost
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'Post submitted successfully');
        done();
      })
    })
  })
  // read posts
  describe('Get request to /posts', function() {
    it('is retrieving posts', function(done) {
      request('http://localhost:' + port + '/posts',
      function(error, response, body) {
        var parsed = JSON.parse(body);
        // set post_id for other tests
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(parsed.info, 'Posts retrieved successfully');
        done();
      })
    })
  })
  // search for post
  describe('Get request to /search/:search_query', function() {
    it('is retrieving search results', function(done) {
      request('http://localhost:' + port + '/search/?query=This+is+a+test-generated+title',
      function(error, response, body) {
        var parsed = JSON.parse(body);
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(parsed.info, 'Search results retrieved successfully');
        assert.equal(parsed.results.length, 1);
        // set post_id for other tests
        editPost.post_id = parsed.results[0]._id;
        newComment.post_id = parsed.results[0]._id;
        editComment.post_id = parsed.results[0]._id;
        newReply.post_id = parsed.results[0]._id;
        editReply.post_id = parsed.results[0]._id;
        done();
      })
    })
  })
  // read single post
  describe('Get request to /posts/one/:post_id', function() {
    it('is retrieving targeted post', function(done) {
      request('http://localhost:' + port + '/posts/one/' + editPost.post_id,
      function(error, response, body) {
        var parsed = JSON.parse(body);
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(parsed.info, 'Post retrieved successfully');
        done();
      })
    })
  })
  // update post
  describe('Put request to /posts', function() {
    it('is updating a post', function(done) {
      request({
        url: 'http://localhost:' + port + '/posts',
        method: 'PUT',
        json: editPost
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'Post updated successfully');
        done();
      })
    })
  })
  // add post to saved
  describe('Put request to /save', function() {
    it('is adding a post to saved', function(done) {
      request({
        url: 'http://localhost:' + port + '/save',
        method: 'PUT',
        json: editPost
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'Post added to saved');
        done();
      })
    })
  })
  // remove post from saved
  describe('Delete request to /save', function() {
    it('is removing a post from saved', function(done) {
      request({
        url: 'http://localhost:' + port + '/save',
        method: 'DELETE',
        json: editPost
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'Post removed from saved');
        done();
      })
    })
  })
  // upvote a post
  describe('Put request to /vote/post, upvote', function() {
    it('is upvoting a post', function(done) {
      editPost.type = 'upvotes';
      request({
        url: 'http://localhost:' + port + '/vote/post',
        method: 'PUT',
        json: editPost
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'Vote added successfully');
        done();
      })
    })
  })
  // downvote a post
  describe('Put request to /vote/post, downvote', function() {
    it('is downvoting a post', function(done) {
      editPost.type = 'downvotes';
      request({
        url: 'http://localhost:' + port + '/vote/post',
        method: 'PUT',
        json: editPost
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'Vote added successfully');
        done();
      })
    })
  })
  // clear votes on a post
  describe('Delete request to /vote/post', function() {
    it('is clearing votes from a post', function(done) {
      request({
        url: 'http://localhost:' + port + '/vote/post',
        method: 'DELETE',
        json: editPost
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'Vote cleared successfully');
        done();
      })
    })
  })
  // create comment
  describe('Post request to /comments, reply to a post', function() {
    it('is creating a new comment', function(done) {
      request({
        url: 'http://localhost:' + port + '/comments',
        method: 'POST',
        json: newComment
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'Comment submitted successfully');
        done();
      })
    })
  })
  // read comment
  describe('Get request to /comments', function() {
    it('is retrieving comments', function(done) {
      request('http://localhost:' + port + '/comments/' + newComment.post_id,
      function(error, response, body) {
        var parsed = JSON.parse(body);
        var added = parsed.results[parsed.results.length - 1];
        editComment.comment_id = added._id;
        newReply.reply_to = added._id;
        editReply.reply_to = added._id;
        // set comment_id for other tests
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(parsed.info, 'Comments retrieved successfully');
        done();
      })
    })
  })
  // update comment
  describe('Put request to /comments', function() {
    it('is updating a comment', function(done) {
      request({
        url: 'http://localhost:' + port + '/comments',
        method: 'PUT',
        json: editComment
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'Comment updated successfully');
        done();
      })
    })
  })
  // upvote a comment
  describe('Put request to /vote/comment, upvote', function() {
    it('is upvoting a comment', function(done) {
      editComment.type = 'upvotes';
      request({
        url: 'http://localhost:' + port + '/vote/comment',
        method: 'PUT',
        json: editComment
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'Vote added successfully');
        done();
      })
    })
  })
  // downvote a comment
  describe('Put request to /vote/comment, downvote', function() {
    it('is downvoting a comment', function(done) {
      editComment.type = 'downvotes';
      request({
        url: 'http://localhost:' + port + '/vote/comment',
        method: 'PUT',
        json: editComment
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'Vote added successfully');
        done();
      })
    })
  })
  // clear votes on a comment
  describe('Delete request to /vote/comment', function() {
    it('is clearing votes from a comment', function(done) {
      request({
        url: 'http://localhost:' + port + '/vote/comment',
        method: 'DELETE',
        json: editComment
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'Vote cleared successfully');
        done();
      })
    })
  })
  // create reply
  describe('Post request to /comments, reply to a comment', function() {
    it('is creating a new reply', function(done) {
      request({
        url: 'http://localhost:' + port + '/comments',
        method: 'POST',
        json: newReply
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'Comment submitted successfully');
        done();
      })
    })
  })
  // read reply
  describe('Get request to /comments', function() {
    it('is retrieving replies', function(done) {
      request('http://localhost:' + port + '/comments/' + newReply.post_id,
      function(error, response, body) {
        var parsed = JSON.parse(body);
        var added = parsed.results[parsed.results.length - 1];
        editReply.comment_id = added._id;
        // set comment_id for other tests
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(parsed.info, 'Comments retrieved successfully');
        done();
      })
    })
  })
  // update reply
  describe('Put request to /comments', function() {
    it('is updating a reply', function(done) {
      request({
        url: 'http://localhost:' + port + '/comments',
        method: 'PUT',
        json: editReply
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'Comment updated successfully');
        done();
      })
    })
  })
  // delete reply
  describe('Delete request to /comments', function() {
    it('is deleting a reply', function(done) {
      request({
        url: 'http://localhost:' + port + '/comments',
        method: 'DELETE',
        json: editReply
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'Comment deleted successfully');
        done();
      })
    })
  })
  // delete comment
  describe('Delete request to /comments', function() {
    it('is deleting a comment', function(done) {
      request({
        url: 'http://localhost:' + port + '/comments',
        method: 'DELETE',
        json: editComment
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'Comment deleted successfully');
        done();
      })
    })
  })
  // delete post
  describe('Delete request to /posts', function() {
    it('is deleting a post', function(done) {
      request({
        url: 'http://localhost:' + port + '/posts',
        method: 'DELETE',
        json: editPost
      }, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.info, 'Post deleted successfully');
        done();
      })
    })
  })
})

describe('Logout and cleanup', function() {
  this.timeout(0);
  this.slow(1400);

  var testUser = {
    user: 'postUserTest',
    password: 'post'
  }

  // logout
  describe('Get request to /user/logout', function() {
    it('is logging out', function(done) {
      request({
        url: 'http://localhost:' + port + '/user/logout',
        method: 'GET'
      }, function(error, response, body) {
        var parsed = JSON.parse(body);
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(parsed.info, 'User logged out successfully');
        done();
      })
    })
  })
  // cleanup
  describe('Cleanup', function() {
    it('is removing testUser', function(done) {
      User.remove({ user: testUser.user }, function(error, results) {
        assert.equal(error, null);
        assert.equal(results.result.ok, 1);
        done();
      })
    })
  })
  after(function() {
    server.close();
  })
})
