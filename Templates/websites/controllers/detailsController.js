(function () {
    "use strict";

    angular.module(APPNAME)
        .controller('detailsController', DetailsController);

    DetailsController.$inject = ['$scope', '$baseController', "$websitesService", '$routeParams', '$location'];

    function DetailsController(
           $scope
         , $baseController
        , $websitesService
        , $routeParams
        , $location
        ) {

        var vm = this;
        vm.headingInfo = "Your websites";
        vm.items = null;
        vm.itemId = null;
        vm.websiteForm = null; 
        vm.showNewWebsiteErrors = false;
       
        vm.$websitesService = $websitesService;
        vm.$scope = $scope;

        vm.receiveItem = _receiveItem;
        vm.onEmpError = _onEmpError;

        vm.updateWebsite = _updateWebsite;
        vm.onUpdateSuccess = _onUpdateSuccess;
        vm.updateID = $("#updateID").val();
        vm.blur = _blur;
        vm.addWebsite = _addWebsite;

        //-- this line to simulate inheritance
        $baseController.merge(vm, $baseController);


        vm.notify = vm.$websitesService.getNotifier($scope);
        vm.websiteId = vm.$routeParams.websiteId;
        
        //this is like the sabio.startUp function
        render();



        function render() {
            console.log('route param is ', $routeParams.websiteId);
            if (vm.updateID && vm.updateID.length > 0) {
                console.log("updateId creating message", vm.updateID);
            }
            vm.$websitesService.loadWebsiteInfo(vm.websiteId, _receiveItem, _onEmpError);
           
            //vm.$websitesService.updateWebsite(payload, updateID, _onUpdateSuccess, _onUpdateError)
      
            
        }
        //Get Ajax success
        function _receiveItem(data) {
            console.log("website id ", data);
            vm.notify(function () {
                vm.itemId = data.item;
            });
            vm.$systemEventService.broadcast("websiteSlug", vm.itemId.slug);
        }
        //GET error
        function _onEmpError(jqXhr, error) {
            console.log(error);
        }

        //Update Website
        function _updateWebsite() {
            vm.showNewEmployeeErrors = true;
            console.log("updating", vm.updateID);
            vm.$websitesService.updateWebsite(vm.itemId, vm.websiteId, vm.onUpdateSuccess, vm.onUpdateError);

        };

            function _addWebsite() {

                vm.showNewWebsiteErrors = true;

                if (vm.websiteForm.$valid) {

                    console.log("data is valid! go save this object ->");
                    if (vm.updateID && vm.updateID.length > 0) {
                        console.log("i have a id,edit mode");
                        vm.$websitesService.updateWebsite(vm.item, vm.websiteId, _onUpdateSuccess, _onUpdateError);
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

        //PUT update  ajax success
            function _onUpdateSuccess(data) {
                console.log("updating success", data);
                vm.$alertService.success("update website");
                $location.path('/list');
                vm.notify(function () {
                    vm.item = data.item;
                });
            }
        
        function _onUpdateError() {
            console.log("updating error");
        }


        function _addWebsite(payload) {
            vm.$websitesService.addWebsite(payload, vm.onAddWebsiteSuccess, vm.onEmpError);
        }


        function _onAddWebsiteSuccess(data) {
            console.log("add website", data);
            vm.notify(function () {
                vm.items = data.items;
            });
        }


        function _blur() {
            console.log("blur");
            vm.itemId.slug = vm.itemId.name
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
            ;
        }

    }
})();
