(function () {
    "use strict";

    angular.module(APPNAME)
        .controller('websiteController', WebsiteController);

    WebsiteController.$inject = ['$scope', '$baseController', "$websitesService", '$routeParams', '$location'];

    function WebsiteController(
        $scope
        , $baseController
        , $websitesService
        , $routeParams
        , $location) {


        var vm = this;
        vm.headingInfo = "Your websites";
        vm.items = null;

        vm.websiteForm = null; //Initialize the form
        vm.showNewWebsiteErrors = false;

        vm.$websitesService = $websitesService;
        vm.$scope = $scope;

        vm.receiveItem = _receiveItem;
        vm.onEmpError = _onEmpError;
        vm.updateWebsite = _updateWebsite;
        vm.onUpdateSuccess = _onUpdateSuccess;
        vm.blur = _blur;
        //vm.addWebsite = _addWebsite;

        //-- this line to simulate inheritance
        $baseController.merge(vm, $baseController);

        //this is a wrapper for our small dependency on $scope
        vm.notify = vm.$websitesService.getNotifier($scope);

        //this is like the sabio.startUp function
        render();

        function render() {
            if (sabio.page.updateID > 0) {
                console.log("updateId creating message", sabio.page.updateID);
                vm.$websitesService.loadWebsiteInfo(sabio.page.updateID, vm.receiveItem, vm.onEmpError); //on success, on error
            }
        }

        function _receiveItem(data) {
            vm.notify(function () {
                vm.item = data.item
            });
        }

        function _onEmpError(jqXhr, error) {
            console.error(error);
        }

        function _updateWebsite() {
            console.log(sabio.page.updateID);
            vm.showNewWebsiteErrors = true;
            if (vm.websiteForm.$valid) {

                console.log("data is valid! go save this object ->");
                if (sabio.page.updateID) {
                    console.log("i have a id,edit mode");
                    vm.$websitesService.updateWebsite(vm.item, sabio.page.updateID, vm.onUpdateSuccess, vm.onEmpError);
                }
                else {
                    console.log("i dont have a id, create mode")
                    vm.$websitesService.addWebsite(vm.item, vm.onAddWebsiteSuccess, vm.onEmpError);
                }
            } 
            else {
                console.log("form submitted with invalid data");
            }

        }
        function _onUpdateSuccess(data) {
            console.log(data, "_onUpdateSuccess");


            vm.notify(function () {
                vm.item = data.item //GET ACCESS THE SIGN DATA FROM AJAX
            });

        }

        function _addWebsite(payload) {
            vm.$websitesService.addWebsite(payload, vm.onAddWebsiteSuccess, vm.onEmpError);

        }
        function _onAddWebsiteSuccess(data) {
            console.log("add website", data);
            //$location.path('/list');
            vm.notify(function () {
                vm.items = data.items;
            });
        }

        function _blur() {
            console.log("blur");
            vm.item.slug = vm.item.name
               .toLowerCase()
               .replace(/ /g, '-')
               .replace(/[^\w-]+/g, '')
            ;
        }

    }
})();