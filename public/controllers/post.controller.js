var app = angular.module('post');

app.controller('postController', post);

app.$inject = ['$http', '$routeParams', '$location', '$scope', 'moment', 'voter', 'saver'];

function post($http, $routeParams, $location, $scope, moment, voter, saver) {
  var vm = this;
  vm.list = [];

  $scope.$on('$locationChangeSuccess', function() {
    if ($location.path() === '/home') {
      vm.refresh('/posts');
      return;
    }
    if ($location.path() === '/saved') {
      vm.refresh('/posts/saved');
      return;
    }
    if ($location.path() === '/search/:search_query') {
      vm.refresh('/search/?query=' + $routeParams.search_query);
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

  vm.refresh = function(path) {
    var request = $http.get(path);

    request.then(function(response) {
      var posts = response.data.results;
      vm.list = posts !== undefined ? posts.reverse() : [];

      return vm.list;
    })
  }

  if ($routeParams.search_query) {
    vm.refresh('/search/?query=' + $routeParams.search_query);
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
