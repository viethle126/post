var app = angular.module('post');

app.controller('userController', user);

app.$inject = ['$http', 'dashboard'];

function user($http, dashboard) {
  var vm = this;
  vm.error = false;
  vm.card = '../views/login.view.html';
  activate();

  function activate() {
    dashboard.get(vm);
  }

  vm.signup = function(user, password) {
    var data = {
      user: user,
      password: password
    }

    var signup = $http.post('/user', data);

    signup.then(function(results) {
      dashboard.get(vm);
      vm.card = '../views/dashboard.view.html';
    }, function(error) {
      vm.error = 409;
    })
  }

  vm.login = function(user, password) {
    var data = {
      user: user,
      password: password
    }

    var login = $http.post('/user/login', data);

    login.then(function(response) {
      dashboard.get(vm);
      vm.card = '../views/dashboard.view.html';
    }, function(error) {
      vm.error = 401;
    })
  }

  vm.logout = function(user) {
    var logout = $http.get('/user/logout');

    logout.then(function(results) {
      vm.error = false;
      vm.card = '../views/login.view.html';
    })
  }
}
