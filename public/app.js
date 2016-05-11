var app = angular.module('post', ['ngRoute', 'angularMoment']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/submit', {
    templateUrl: 'views/submit.view.html',
  })
  .when('/home', {
    templateUrl: 'views/posts.view.html',
  })
  .when('/saved', {
    templateUrl: 'views/posts.view.html',
  })
  .otherwise({
    redirectTo: '/home'
  })
}]);
