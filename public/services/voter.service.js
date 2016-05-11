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

  return {
    retract: retract,
    vote: vote
  }
}
