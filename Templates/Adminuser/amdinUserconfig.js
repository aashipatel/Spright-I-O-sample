(function () {
    "use strict";

    angular.module(APPNAME)
        .config(["$routeProvider", "$locationProvider", 
            function ($routeProvider, $locationProvider) {

            $routeProvider.when('/edit/:userId', {
                templateUrl: '/Scripts/sabio/application/Adminuser/templates/manage.html',
                controller: 'adminUserManageController',
                controllerAs: 'adminUser'
            }).when('/', {
                templateUrl: '/Scripts/sabio/application/Adminuser/templates/index.html',
                controller: 'adminUserIndexController',
                controllerAs: 'adminUser'
            })
            $locationProvider.html5Mode(false);

        }]);

})();