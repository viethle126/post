var app = angular.module('post');

app.factory('saver', saver);

dashboard.$inject = ['$http'];

function saver($http) {

  function save(item) {
    var data = {
      post_id: item._id
    }

    $http({
      url: '/save',
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      data: data
    }).then(function() {
      item.isSaved = true;
      return item;
    }, function(error) {
      console.error(error);
      // will implement notifications later
    })
  }

  function unsave(item) {
    var data = {
      post_id: item._id
    }

    $http({
      url: '/save',
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' },
      data: data
    }).then(function() {
      item.isSaved = false;
      return item;
    }, function(error) {
      console.error(error);
      // will implement notifications later
    })
  }

  return {
    save: save,
    unsave: unsave
  }
}
