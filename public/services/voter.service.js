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
    if (item.value !== 1) {
      retract(item, 'upvotes');
      item.change+= 1 - item.value;
      return item.value = 1;
    }

    if (item.value === 1) {
      retract(item);
      item.change--;
      return item.value = 0;
    }
  }

  function down(item) {
    if (item.value !== -1) {
      retract(item, 'downvotes');
      item.change-= 1 + item.value;
      return item.value = -1;
    }

    if (item.value === -1) {
      retract(item);
      item.change++;
      return item.value = 0;
    }
  }

  return {
    up: up,
    down: down
  }
}
