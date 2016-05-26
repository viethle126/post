var app = angular.module('post');

app.controller('leaderboardController', leaderboard);

app.$inject = ['$http'];

function leaderboard($http) {
  var vm = this;
  
  vm.activate = function() {
    var users = $http.get('/leaderboard');

    users.then(function(results) {
      vm.list = results.data.results;
    })
  }

  vm.activate();
}
