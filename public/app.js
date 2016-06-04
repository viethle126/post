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
  .when('/search/:search_query', {
    // declare controller to pass routeParams
    templateUrl: 'views/posts.view.html',
    controller: 'postController',
    controllerAs: 'post',
  })
  .when('/comments/:post_id', {
    // declare controller to pass routeParams
    templateUrl: 'views/comments.view.html',
    controller: 'commentController',
    controllerAs: 'comment',
  })
  .otherwise({
    redirectTo: '/home',
  });
}]);
