var assert = require('chai').assert;
var request = require('request');
// server
var RANDOMIZE = 0;
var app = require('./app.js');
var server = app.listen(RANDOMIZE);
var port = server.address().port;
// mongoose
var mongoose = require('mongoose');
var User = require('./models/user');

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

// user
describe('/user', function() {
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
