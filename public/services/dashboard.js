var app = angular.module('post');

app.factory('dashboard', dashboard);

dashboard.$inject = ['$http'];

function dashboard($http) {

  function get(vm) {
    var dash = $http.get('http://localhost:1337/user');

    dash.then(function(results) {
      console.log(results);
      if (results.data) {
        vm.user = results.data.user;
        vm.posts = results.data.posts;
        vm.upvotes = results.data.upvotes;
        vm.downvotes = results.data.downvotes;
        vm.saves = results.data.saves;
        vm.score = results.data.score;
        vm.card = './views/dashboard.html';
        return vm;
      }
    })
  }

  return {
    get: get
  }
}
