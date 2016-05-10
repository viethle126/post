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

// user
describe('/user', function() {
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
  // read, correct credentials
  describe('Post request to /user/login right credentials', function() {
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
  // read, incorrect credentials
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
  // read, unknown user
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
})

describe('/posts', function() {
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
        var added = parsed.results[parsed.results.length - 1];
        editPost.post_id = added._id;
        // set editPost.post_ID for next test
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(parsed.info, 'Posts retrieved successfully');
        done();
      })
    })
  })
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
