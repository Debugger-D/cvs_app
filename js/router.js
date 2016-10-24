angular.module('cvsApp').run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]).config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        })
        .state('home', {
            url: "/home",
            templateUrl: 'views/home.html',
            controller: 'homeCtrl'
        })
        .state('pay', {
            url: "/pay/:amount",
            templateUrl: 'views/pay.html',
            controller: 'payCtrl'
        })
}]);