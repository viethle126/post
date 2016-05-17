var app = angular.module('post');

app.controller('postController', post);

app.$inject = ['$http', '$location', '$scope', 'moment', 'voter', 'saver'];

function post($http, $location, $scope, moment, voter, saver) {
  var vm = this;
  vm.list = [];

  $scope.$on('$locationChangeSuccess', function() {
    if ($location.path() === '/home') {
      vm.home();
      return;
    }
    if ($location.path() === '/saved') {
      vm.saved();
      return;
    }
  })

  vm.submit = function(title, link, text) {
    var data = {
      title: title,
      link: link,
      text: text
    }

    var post = $http.post('/posts', data);

    post.then(function() {
      $location.path('#/home');
    }, function(error) {
      console.error(error);
      // will implement notifications later
    })
  }

  vm.home = function() {
    var request = $http.get('/posts');

    request.then(function(response) {
      var posts = response.data.results;
      vm.list = posts !== undefined ? posts.reverse() : [];

      return vm.list;
    })
  }

  vm.saved = function() {
    var request = $http.get('/posts/saved');

    request.then(function(response) {
      var posts = response.data.results;
      vm.list = posts !== undefined ? posts.reverse() : [];

      return vm.list;
    })
  }

  vm.up = function(item) {
    voter.up('post', item);
  }

  vm.down = function(item) {
    voter.down('post', item);
  }

  vm.save = function(item) {
    saver.save(item);
  }

  vm.unsave = function(item) {
    saver.unsave(item);
  }
}