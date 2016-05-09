var app = angular.module('post');

app.controller('userController', user);

app.$inject = ['$http', 'dashboard'];

function user($http, dashboard) {
  var vm = this;
  vm.error = false;
  vm.card = 'views/user.html';
  activate();

  function activate() {
    dashboard.get(vm);
  }

  vm.signup = function(user, password) {
    var signup = $http.post(
      'http://localhost:1337/user',
      { user: user, password: password }
    );
    signup.then(function(results) {
      dashboard.get(vm);
      vm.card = './views/dashboard.html';
    }, function(error) {
      vm.error = 409;
    })
  }

  vm.login = function(user, password) {
    var login = $http.post(
      'http://localhost:1337/user/login',
      { user: user, password: password }
    );
    login.then(function(response) {
      dashboard.get(vm);
      vm.card = './views/dashboard.html';
    }, function(error) {
      vm.error = 401;
    })
  }

  vm.logout = function(user) {
    var logout = $http.get('http://localhost:1337/user/logout');
    logout.then(function(results) {
      vm.error = false;
      vm.card = './views/user.html'
    })
  }
}
