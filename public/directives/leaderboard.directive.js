var app = angular.module('post');

app.directive('leaderboard', leaderboard);

function leaderboard() {
  return {
    templateUrl: 'directives/leaderboard.directive.html'
  }
}
