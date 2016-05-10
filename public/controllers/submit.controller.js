var app = angular.module('post');

app.controller('submitController', submit);

app.$inject = ['$http', '$location'];

function submit($http, $location) {
  var vm = this;

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
}
