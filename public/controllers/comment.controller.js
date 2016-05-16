var app = angular.module('post');

app.controller('commentController', comment);

app.$inject = ['$http', '$routeParams', 'moment', 'voter'];

function comment($http, $routeParams, moment, voter) {
  var vm = this;
  vm.post_id = $routeParams.post_id;

  function activate() {
    vm.loadPost();
    vm.loadComments();
  }

  vm.loadPost = function() {
    var request = $http.get('/posts/one/' + vm.post_id);

    request.then(function(response) {
      vm.post = response.data.results[0];
      return vm.post;
    })
  }

  vm.loadComments = function() {
    var request = $http.get('/comments/' + vm.post_id);

    request.then(function(response) {
      vm.list = response.data.results;

      return vm.list;
    })
  }

  vm.reply = function(text, original) {
    var data = {
      post_id: vm.post_id,
      reply_to: original ? original : 'post',
      comment: text
    }

    var replying = $http.post('/comments', data);

    replying.then(function() {
      vm.text = '';
    }, function(error) {
      console.error(error);
      // will implement notifications later
    })
  }

  vm.up = function(item) {
    voter.up(item);
  }

  vm.down = function(item) {
    voter.down(item);
  }

  activate();
}
