var app = angular.module('post');

app.directive('replies', replies);

function replies($compile) {
  return {
    restrict: "E",
    replace: true,
    templateUrl: 'directives/replies.directive.html',
    link: function(scope, element, attributes) {
      if (scope.reply.thread) {
        $compile('<thread thread="reply.thread"></thread>')(scope, function(cloned, scope){
           element.append(cloned);
        });
      }
    }
  }
}
