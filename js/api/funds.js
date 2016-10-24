angular.module('cvsApp').factory('fundsAPI', ["$resource", function ($resource) {
    var fundsUrl = '/cvsFunds/';

    return $resource(null, null, {
        get: {
            method: 'GET',
            url: fundsUrl + 'account/info'
        }
    })
}]);