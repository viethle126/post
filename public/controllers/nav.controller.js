var app = angular.module('post');

app.controller('navController', nav);

app.$inject = ['$http', '$location', '$scope'];

function nav($http, $location, $scope) {
  var vm = this;
  vm.isActive = $location.path();

  $scope.$on('$locationChangeSuccess', function() {
    vm.isActive = $location.path();
  })
}
