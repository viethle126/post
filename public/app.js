var app = angular.module('post', ['ngRoute', 'angularMoment']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/submit', {
    templateUrl: 'views/submit.view.html',
    controller: 'submitController',
    controllerAs: 'submit',
  })
  .when('/home', {
    templateUrl: 'views/posts.view.html',
  })
  .when('/saved', {
    templateUrl: 'views/posts.view.html',
  })
  .when('/comments/:post_id', {
    templateUrl: 'views/comments.view.html',
    controller: 'commentController',
    controllerAs: 'comment',
  })
  .otherwise({
    redirectTo: '/home',
  })
}]);
