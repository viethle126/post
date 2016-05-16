var app = angular.module('post');

app.factory('voter', voter);

dashboard.$inject = ['$http'];

function voter($http) {

  function retract(item, type) {
    var data = {
      post_id: item._id
    }

    $http({
      url: '/vote/post',
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' },
      data: data
    }).then(function() {
      if (type) {
        vote(item, type);
      }
    }, function(error) {
      console.error(error);
      // will implement notifications later
    })
  }

  function vote(item, type) {
    var data = {
      post_id: item._id,
      type: type
    }

    var voting = $http.put('/vote/post', data);
    voting.then({}, function(error) {
      console.error(error);
      // will implement notifications later
    })
  }

  function up(item) {
    if (item.state === 'upvoted') {
      retract(item);
      item.state = 'neutral'
      item.score = item.up[1];
      return item;
    } else {
      retract(item, 'upvotes');
      item.state = 'upvoted';
      item.score = item.up[0];
      return item;
    }
  }

  function down(item) {
    if (item.state === 'downvoted') {
      retract(item);
      item.state = 'neutral'
      item.score = item.down[1];
      return item;
    } else {
      retract(item, 'downvotes');
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
