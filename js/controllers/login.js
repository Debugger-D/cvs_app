angular.module('cvsApp').controller('loginCtrl', ["$rootScope","$scope", "$location", "accountAPI", function ($rootScope,$scope, $location, accountAPI) {
    $scope.login = function (data) {
        var phone = data.phone;
        var password = data.password;

        accountAPI.login({}, "phone="+phone+"&password="+password, function (data) {
            $scope.showSuccess=true;
            // $rootScope.blance=data.usableBalance;
            document.cookie="userId="+data.userId;
            $location.path('home');
        }, function (data) {
            $scope.loadfail = true;
            $scope.error_description = data.data.error ? data.data.error.description || '服务器挂了！！' : '服务器挂了！！';
        });
    };
}]);