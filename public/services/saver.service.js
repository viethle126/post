var app = angular.module('post');

app.factory('saver', saver);

dashboard.$inject = ['$http'];

function saver($http) {

  function save(item, undo) {
    var data = {
      post_id: item._id
    };

    $http({
      url: '/save',
      method: undo ? 'DELETE' : 'PUT',
      headers: { 'Content-type': 'application/json' },
      data: data
    }).then(function() {
      item.isSaved = undo ? false : true;
      return item;
    }, function(error) {
      console.error(error);
      // will implement notifications later
    });
  }

  return {
    save: save,
  }
}
