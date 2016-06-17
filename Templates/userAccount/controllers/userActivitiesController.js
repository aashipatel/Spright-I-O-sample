(function () {
    "use strict";

    angular.module(APPNAME)
        .controller('userActivitiesController', UserActivitiesController);

    UserActivitiesController.$inject = ['$scope', '$baseController', "$systemActivityService"];

    function UserActivitiesController(
          $scope
        , $baseController
        , $systemActivityService) {

        var vm = this;

        $baseController.merge(vm, $baseController);
        vm.$systemActivityService = $systemActivityService;
        vm.$scope = $scope;
        vm.notify = vm.$systemActivityService.getNotifier($scope);

        //-----------------------------------------------------------------//   

        vm.currentPage = 1;
        vm.pageSize = 10;
        vm.totalItems = null;
        vm.items = [];

        vm.loadRows = _loadRows;
        vm.itemsLoaded = _itemsLoaded;
        vm.ajaxError = _ajaxError;
        vm.formatDate = _formatDate;
        vm.pageChangeHandler = _pageChangeHandler;

        render();

        function render() {
            
             vm.loadRows();
            
        };

        function _loadRows(){

            var payload = {
                currentPage: vm.currentPage,
                itemsPerPage: vm.pageSize
            }

            vm.$systemActivityService.listCurrentUserActivities(payload, vm.itemsLoaded, vm.ajaxError);
        };

        function _itemsLoaded(data) {

            vm.notify(function () {
                vm.items = data.items;
                vm.totalItems = data.totalItems;
                vm.currentPage = data.currentPage;
            });
            //console.log("items are ", data);
        };

        function _ajaxError() {

        };

        function _formatDate(date) {
            var localDate = moment.utc(date).local().format('MMMM Do YYYY, h:mm:ss a');
            //console.log("local time is %s, utc time is %s", localDate, date);
            return localDate;

        }

        //pagination controls
        function _pageChangeHandler(currentPage) {

            vm.currentPage = currentPage;

            vm.loadRows();
            //console.log('page number changed to ' + vm.totalItems);
        };

    }
})();