var app = angular.module('post');

app.directive('thread', thread);

function thread() {
  return {
    restrict: "E",
    replace: true,
    scope: {
        thread: '='
    },
    templateUrl: 'directives/thread.directive.html'
  }
}
