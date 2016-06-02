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
      vm.comments = [];
      vm.replies = {};
      vm.count = response.data.results.length;
      response.data.results.forEach(function(element, index, array) {
        if (element.reply_to !== 'post') {
          if (vm.replies[element.reply_to]) {
            vm.replies[element.reply_to].push(element);
            return;
          } else {
            vm.replies[element.reply_to] = [];
            vm.replies[element.reply_to].push(element);
            return;
          }
        }
        vm.comments.push(element);
        return;
      })
      vm.comments = vm.comments.reverse();
      vm.comments.forEach(function(element, index, array) {
        vm.tree(element);
      })
      return;
    })
  }

  vm.tree = function(comment) {
    if (vm.replies[comment._id]) {
      comment.thread = vm.replies[comment._id];
      comment.thread.forEach(function(element, index, array) {
        vm.tree(element);
      })
    } else {
      return comment;
    }
  }

  vm.reply = function(text, original) {
    if (text === undefined || text === '') {
      return;
    }

    var data = {
      post_id: vm.post_id,
      reply_to: original ? original._id : 'post',
      comment: text
    }

    var replying = $http.post('/comments', data);

    replying.then(function() {
      if (original) {
        original.replying = false;
      }

      vm.text = '';
      vm.loadComments();
    }, function(error) {
      console.error(error);
      // will implement notifications later
    })
  }

  vm.edit = function(item) {
    if (item.editComment === undefined || item.editComment === '') {
      return;
    }

    var data = {
      comment_id: item._id,
      comment: item.editComment
    }

    var update = $http.put('/comments', data);

    update.then(function() {
      item.comment = item.editComment;
      item.editing = false;
    }, function(error) {
      console.error(error);
      // will implement notifications later
    })
  }

  vm.cancel = function(item) {
    item.editComment = item.comment;
    item.editing = false;
    item.replying = false;
  }

  vm.up = function(item) {
    voter.up('comment', item);
  }

  vm.down = function(item) {
    voter.down('comment', item);
  }

  activate();
}
