angular.module('cvsApp').factory('accountAPI', ["$resource", function ($resource) {
    var accountUrl = '/account/'
    return $resource(accountUrl + 'user/phone/exist/:phone', {}, {
        exist: {//http://devtest.pocketwallet.cn/account/user/islogined
            method: 'GET'
        },
        login:{
            method: 'POST',
            url: accountUrl + "user/login",
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        },
        logout:{
            method: 'POST',
            url: accountUrl + 'user/logout' + '?time=' + new Date().getTime(),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        },
        islogined:{
            method: 'GET',
            url: accountUrl + 'user/islogined',
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        }
    })
}]);