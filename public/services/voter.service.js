var app = angular.module('post');

app.factory('voter', voter);

dashboard.$inject = ['$http'];

function voter($http) {

  function retract(path, item, type) {
    var data = {
      post_id: item._id
    }

    $http({
      url: '/vote/' + path,
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' },
      data: data
    }).then(function() {
      if (type) {
        vote(path, item, type);
      }
    }, function(error) {
      console.error(error);
      // will implement notifications later
    })
  }

  function vote(path, item, type) {
    var data = {
      post_id: item._id,
      comment_id: item._id,
      type: type
    }

    var voting = $http.put('/vote/' + path, data);
    voting.then({}, function(error) {
      console.error(error);
      // will implement notifications later
    })
  }

  function up(path, item) {
    if (item.state === 'upvoted') {
      retract(path, item);
      item.state = 'neutral'
      item.score = item.up[1];
      return item;
    } else {
      retract(path, item, 'upvotes');
      item.state = 'upvoted';
      item.score = item.up[0];
      return item;
    }
  }

  function down(path, item) {
    if (item.state === 'downvoted') {
      retract(path, item);
      item.state = 'neutral'
      item.score = item.down[1];
      return item;
    } else {
      retract(path, item, 'downvotes');
      item.state = 'downvoted';
      item.score = item.down[0];
      return item;
    }
  }

  return {
    up: up,
    down: down
  }
}
