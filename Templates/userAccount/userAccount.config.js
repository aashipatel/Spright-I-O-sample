(function () {
    "use strict";

    angular.module(APPNAME)
        .config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {

            $routeProvider.when('/user/accountInfo', {
                templateUrl: '/Scripts/sabio/application/userAccount/templates/accountInfoTab.html',
                controller: 'accountInfoController',
                controllerAs: 'ac'
            }).when('/user/address', {
                templateUrl: '/Scripts/sabio/application/userAccount/templates/addressTab.html',
                controller: 'addressController',
                controllerAs: 'adc'
            }).when('/user/avatar', {
                templateUrl: '/Scripts/sabio/application/userAccount/templates/avatarTab.html',
                controller: 'avatarController',
                controllerAs: 'ava'
            }).when('/user/background', {
                templateUrl: '/Scripts/sabio/application/userAccount/templates/backgroundTab.html',
                controller: 'backgroundController',
                controllerAs: 'bg'
            }).when('/user/notification', {
                templateUrl: '/Scripts/sabio/application/userAccount/templates/notificationTab.html',
                controller: 'notificationController',
                controllerAs: 'nc'
            }).when('/user/sms', {
                templateUrl: '/Scripts/sabio/application/userAccount/templates/smsTab.html',
                controller: 'smsController',
                controllerAs: 'smsc'
            });;

            $locationProvider.html5Mode(false);

        }]);

})();