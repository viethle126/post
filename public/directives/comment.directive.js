var app = angular.module('post');

app.directive('comment', comment);

function comment() {
  return {
    templateUrl: 'directives/comment.directive.html'
  }
}
