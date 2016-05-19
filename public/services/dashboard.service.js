var app = angular.module('post');

app.factory('dashboard', dashboard);

dashboard.$inject = ['$http'];

function dashboard($http) {

  function get(vm) {
    var dash = $http.get('/user');

    dash.then(function(results) {
      if (results.data) {
        vm.user = results.data.user;
        vm.posts = results.data.posts;
        vm.upvotes = results.data.upvotes;
        vm.downvotes = results.data.downvotes;
        vm.saves = results.data.saves;
        vm.score = results.data.upvotes - results.data.downvotes;
        vm.card = '../views/dashboard.view.html';
        return vm;
      }
    })
  }

  return {
    get: get
  }
}
