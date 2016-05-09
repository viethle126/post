var app = angular.module('post');

app.controller('userController', user);

app.$inject = ['$http'];

function user($http) {
  var vm = this;
  vm.error = false;
  vm.card = 'views/user.html';

  vm.signup = function(user, password) {
    var signup = $http.post(
      'http://localhost:1337/user',
      { user: user, password: password }
    );
    signup.then(function(results) {
      vm.card = './views/dashboard.html';
    }, function(error) {
      vm.error = true;
    })
  }

  vm.login = function(user, password) {
    var login = $http.post(
      'http://localhost:1337/user/login',
      { user: user, password: password }
    );
    login.then(function(response) {
      vm.card = './views/dashboard.html';
    }, function(error) {
      vm.error = true;
    })
  }

  vm.logout = function(user) {
    var logout = $http.post(
      'http://localhost:1337/user/logout',
      { user: user }
    );
    logout.then(function(results) {
      vm.error = false;
      vm.card = './views/user.html'
    })
  }
}
