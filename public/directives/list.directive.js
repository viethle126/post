var app = angular.module('post');

app.directive('list', list);

function list() {
  return {
    templateUrl: 'directives/list.directive.html'
  }
}
