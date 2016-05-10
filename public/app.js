var app = angular.module('post', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/submit', {
    templateUrl: 'views/submit.view.html',
  })
  .when('/home', {
    templateUrl: 'views/home.view.html',
  })
  .when('/saved', {
    templateUrl: 'views/saved.view.html',
  })
  .otherwise({
    redirectTo: '/home'
  })
}]);
