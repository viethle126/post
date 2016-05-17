var app = angular.module('post');

app.directive('navbar', navbar);

function navbar() {
  return {
    templateUrl: 'directives/navbar.directive.html'
  }
}
