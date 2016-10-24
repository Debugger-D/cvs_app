angular.module('cvsApp').factory('goods', ["$resource", "settings", function ($resource, settings) {
    return $resource(null, null, {
        getList: {
            method: 'GET',
            url: settings.cvsUrl + 'goods?pageSize=1000'
        }
    })
}]);